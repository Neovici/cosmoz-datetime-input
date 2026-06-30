import { f as f$1, w, j, T, m, x } from './directive-helpers-CfAJTfKJ.js';

let current;
let currentId = 0;
function setCurrent(state) {
    current = state;
}
function clear() {
    current = null;
    currentId = 0;
}
function notify() {
    return currentId++;
}

const phaseSymbol = Symbol("haunted.phase");
const hookSymbol = Symbol("haunted.hook");
const updateSymbol = Symbol("haunted.update");
const commitSymbol = Symbol("haunted.commit");
const effectsSymbol = Symbol("haunted.effects");
const layoutEffectsSymbol = Symbol("haunted.layoutEffects");
const contextEvent = "haunted.context";

class State {
    update;
    host;
    virtual;
    [hookSymbol];
    [effectsSymbol];
    [layoutEffectsSymbol];
    constructor(update, host) {
        this.update = update;
        this.host = host;
        this[hookSymbol] = new Map();
        this[effectsSymbol] = [];
        this[layoutEffectsSymbol] = [];
    }
    run(cb) {
        setCurrent(this);
        let res = cb();
        clear();
        return res;
    }
    _runEffects(phase) {
        let effects = this[phase];
        setCurrent(this);
        for (let effect of effects) {
            effect.call(this);
        }
        clear();
    }
    runEffects() {
        this._runEffects(effectsSymbol);
    }
    runLayoutEffects() {
        this._runEffects(layoutEffectsSymbol);
    }
    teardown() {
        let hooks = this[hookSymbol];
        hooks.forEach((hook) => {
            if (typeof hook.teardown === "function") {
                hook.teardown();
            }
        });
    }
}

const defer = Promise.resolve().then.bind(Promise.resolve());
function runner() {
    let tasks = [];
    let id;
    function runTasks() {
        id = null;
        let t = tasks;
        tasks = [];
        for (var i = 0, len = t.length; i < len; i++) {
            t[i]();
        }
    }
    return function (task) {
        tasks.push(task);
        if (id == null) {
            id = defer(runTasks);
        }
    };
}
const read = runner();
const write = runner();
class BaseScheduler {
    renderer;
    host;
    state;
    [phaseSymbol];
    _updateQueued;
    constructor(renderer, host) {
        this.renderer = renderer;
        this.host = host;
        this.state = new State(this.update.bind(this), host);
        this[phaseSymbol] = null;
        this._updateQueued = false;
    }
    update() {
        if (this._updateQueued)
            return;
        read(() => {
            let result = this.handlePhase(updateSymbol);
            write(() => {
                this.handlePhase(commitSymbol, result);
                write(() => {
                    this.handlePhase(effectsSymbol);
                });
            });
            this._updateQueued = false;
        });
        this._updateQueued = true;
    }
    handlePhase(phase, arg) {
        this[phaseSymbol] = phase;
        switch (phase) {
            case commitSymbol:
                this.commit(arg);
                this.runEffects(layoutEffectsSymbol);
                return;
            case updateSymbol:
                return this.render();
            case effectsSymbol:
                return this.runEffects(effectsSymbol);
        }
    }
    render() {
        return this.state.run(() => this.renderer.call(this.host, this.host));
    }
    runEffects(phase) {
        this.state._runEffects(phase);
    }
    teardown() {
        this.state.teardown();
    }
}

const toCamelCase = (val = "") => val.replace(/-+([a-z])?/g, (_, char) => (char ? char.toUpperCase() : ""));
function makeComponent(render) {
    class Scheduler extends BaseScheduler {
        frag;
        renderResult;
        constructor(renderer, frag, host) {
            super(renderer, (host || frag));
            this.frag = frag;
        }
        commit(result) {
            this.renderResult = render(result, this.frag);
        }
    }
    function component(renderer, baseElementOrOptions, options) {
        const BaseElement = (options || baseElementOrOptions || {}).baseElement ||
            HTMLElement;
        const { observedAttributes = [], useShadowDOM = true, shadowRootInit = {}, styleSheets, } = options || baseElementOrOptions || {};
        class Element extends BaseElement {
            _scheduler;
            static get observedAttributes() {
                return renderer.observedAttributes || observedAttributes || [];
            }
            constructor() {
                super();
                if (useShadowDOM === false) {
                    this._scheduler = new Scheduler(renderer, this);
                }
                else {
                    const shadowRoot = this.attachShadow({
                        mode: "open",
                        ...shadowRootInit,
                    });
                    if (styleSheets)
                        shadowRoot.adoptedStyleSheets = styleSheets;
                    this._scheduler = new Scheduler(renderer, shadowRoot, this);
                }
            }
            connectedCallback() {
                this._scheduler.update();
                this._scheduler.renderResult?.setConnected(true);
            }
            disconnectedCallback() {
                this._scheduler.teardown();
                this._scheduler.renderResult?.setConnected(false);
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) {
                    return;
                }
                let val = newValue === "" ? true : newValue;
                Reflect.set(this, toCamelCase(name), val);
            }
        }
        function reflectiveProp(initialValue) {
            let value = initialValue;
            let isSetup = false;
            return Object.freeze({
                enumerable: true,
                configurable: true,
                get() {
                    return value;
                },
                set(newValue) {
                    // Avoid scheduling update when prop value hasn't changed
                    if (isSetup && value === newValue)
                        return;
                    isSetup = true;
                    value = newValue;
                    if (this._scheduler) {
                        this._scheduler.update();
                    }
                },
            });
        }
        const proto = new Proxy(BaseElement.prototype, {
            getPrototypeOf(target) {
                return target;
            },
            set(target, key, value, receiver) {
                let desc;
                if (key in target) {
                    desc = Object.getOwnPropertyDescriptor(target, key);
                    if (desc && desc.set) {
                        desc.set.call(receiver, value);
                        return true;
                    }
                    Reflect.set(target, key, value, receiver);
                    return true;
                }
                if (typeof key === "symbol" || key[0] === "_") {
                    desc = {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value,
                    };
                }
                else {
                    desc = reflectiveProp(value);
                }
                Object.defineProperty(receiver, key, desc);
                if (desc.set) {
                    desc.set.call(receiver, value);
                }
                return true;
            },
        });
        Object.setPrototypeOf(Element.prototype, proto);
        return Element;
    }
    return component;
}

class Hook {
    id;
    state;
    constructor(id, state) {
        this.id = id;
        this.state = state;
    }
}
function use(Hook, ...args) {
    let id = notify();
    let hooks = current[hookSymbol];
    let hook = hooks.get(id);
    if (!hook) {
        hook = new Hook(id, current, ...args);
        hooks.set(id, hook);
    }
    return hook.update(...args);
}
function hook(Hook) {
    return use.bind(null, Hook);
}

function createEffect(setEffects) {
    return hook(class extends Hook {
        callback;
        lastValues;
        values;
        _teardown;
        constructor(id, state, ignored1, ignored2) {
            super(id, state);
            setEffects(state, this);
        }
        update(callback, values) {
            this.callback = callback;
            this.values = values;
        }
        call() {
            const hasChanged = !this.values || this.hasChanged();
            this.lastValues = this.values;
            if (hasChanged) {
                this.run();
            }
        }
        run() {
            this.teardown();
            this._teardown = this.callback.call(this.state);
        }
        teardown() {
            if (typeof this._teardown === "function") {
                this._teardown();
            }
        }
        hasChanged() {
            return (!this.lastValues ||
                this.values.some((value, i) => this.lastValues[i] !== value));
        }
    });
}

function setEffects(state, cb) {
    state[effectsSymbol].push(cb);
}
/**
 * @function
 * @param {() => void} effect - callback function that runs each time dependencies change
 * @param {unknown[]} [dependencies] - list of dependencies to the effect
 * @return {void}
 */
const useEffect = createEffect(setEffects);

const getEmitter = (host) => {
    if (host instanceof Element)
        return host;
    return host.startNode || host.endNode || host.parentNode;
};
/**
 * @function
 * @template T
 * @param    {Context<T>} context
 * @return   {T}
 */
const useContext = hook(class extends Hook {
    Context;
    value;
    _ranEffect;
    _unsubscribe;
    constructor(id, state, _) {
        super(id, state);
        this._updater = this._updater.bind(this);
        this._ranEffect = false;
        this._unsubscribe = null;
        setEffects(state, this);
    }
    update(Context) {
        if (this.Context !== Context) {
            this._subscribe(Context);
            this.Context = Context;
        }
        return this.value;
    }
    call() {
        if (!this._ranEffect) {
            this._ranEffect = true;
            if (this._unsubscribe)
                this._unsubscribe();
            this._subscribe(this.Context);
            this.state.update();
        }
    }
    _updater(value) {
        this.value = value;
        this.state.update();
    }
    _subscribe(Context) {
        const detail = { Context, callback: this._updater };
        const emitter = getEmitter(this.state.host);
        emitter.dispatchEvent(new CustomEvent(contextEvent, {
            detail, // carrier
            bubbles: true, // to bubble up in tree
            cancelable: true, // to be able to cancel
            composed: true, // to pass ShadowDOM boundaries
        }));
        const { unsubscribe = null, value } = detail;
        this.value = unsubscribe ? value : Context.defaultValue;
        this._unsubscribe = unsubscribe;
    }
    teardown() {
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
});

function makeContext(component) {
    return (defaultValue) => {
        const Context = {
            Provider: class extends HTMLElement {
                listeners;
                _value;
                constructor() {
                    super();
                    this.listeners = new Set();
                    this.addEventListener(contextEvent, this);
                }
                disconnectedCallback() {
                    this.removeEventListener(contextEvent, this);
                }
                handleEvent(event) {
                    const { detail } = event;
                    if (detail.Context === Context) {
                        detail.value = this.value;
                        detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);
                        this.listeners.add(detail.callback);
                        event.stopPropagation();
                    }
                }
                unsubscribe(callback) {
                    this.listeners.delete(callback);
                }
                set value(value) {
                    this._value = value;
                    for (let callback of this.listeners) {
                        callback(value);
                    }
                }
                get value() {
                    return this._value;
                }
            },
            Consumer: component(function ({ render }) {
                const context = useContext(Context);
                return render(context);
            }, { useShadowDOM: false }),
            defaultValue,
        };
        return Context;
    };
}

/**
 * @function
 * @template T
 * @param  {() => T} fn function to memoize
 * @param  {unknown[]} values dependencies to the memoized computation
 * @return {T} The next computed value
 */
const useMemo = hook(class extends Hook {
    value;
    values;
    constructor(id, state, fn, values) {
        super(id, state);
        this.value = fn();
        this.values = values;
    }
    update(fn, values) {
        if (this.hasChanged(values)) {
            this.values = values;
            this.value = fn();
        }
        return this.value;
    }
    hasChanged(values = []) {
        return values.some((value, i) => this.values[i] !== value);
    }
});

/**
 * @function
 * @template {Function} T
 * @param    {T} fn - callback to memoize
 * @param    {unknown[]} inputs - dependencies to callback memoization
 * @return   {T}
 */
const useCallback = (fn, inputs) => useMemo(() => fn, inputs);

function setLayoutEffects(state, cb) {
    state[layoutEffectsSymbol].push(cb);
}
/**
 * @function
 * @param  {Effect} callback effecting callback
 * @param  {unknown[]} [values] dependencies to the effect
 * @return {void}
 */
createEffect(setLayoutEffects);

/**
 * @function
 * @template {*} T
 * @param {T} [initialState] - Optional initial state
 * @return {readonly [state: T, updaterFn: StateUpdater<T>]} stateTuple - Tuple of current state and state updater function
 */
const useState = hook(class extends Hook {
    args;
    constructor(id, state, initialValue) {
        super(id, state);
        this.updater = this.updater.bind(this);
        if (typeof initialValue === "function") {
            initialValue = initialValue();
        }
        this.makeArgs(initialValue);
    }
    update() {
        return this.args;
    }
    updater(value) {
        const [previousValue] = this.args;
        if (typeof value === "function") {
            const updaterFn = value;
            value = updaterFn(previousValue);
        }
        if (Object.is(previousValue, value)) {
            return;
        }
        this.makeArgs(value);
        this.state.update();
    }
    makeArgs(value) {
        this.args = Object.freeze([value, this.updater]);
    }
});

/**
 * Given a reducer function, initial state, and optional state initializer function, returns a tuple of state and dispatch function.
 * @function
 * @template S State
 * @template I Initial State
 * @template A Action
 * @param {Reducer<S, A>} reducer - reducer function to compute the next state given the previous state and the action
 * @param {I} initialState - the initial state of the reducer
 * @param {(init: I) => S} [init=undefined] - Optional initializer function, called on initialState if provided
 * @return {readonly [S, (action: A) => void]}
 */
hook(class extends Hook {
    reducer;
    currentState;
    constructor(id, state, _, initialState, init) {
        super(id, state);
        this.dispatch = this.dispatch.bind(this);
        this.currentState =
            init !== undefined ? init(initialState) : initialState;
    }
    update(reducer) {
        this.reducer = reducer;
        return [this.currentState, this.dispatch];
    }
    dispatch(action) {
        this.currentState = this.reducer(this.currentState, action);
        this.state.update();
    }
});

function useRef(initialValue) {
    return useMemo(() => ({
        current: initialValue,
    }), []);
}

function pion({ render }) {
    const component = makeComponent(render);
    const createContext = makeContext(component);
    return { component, createContext };
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=(i,t)=>{const e=i._$AN;if(void 0===e)return  false;for(const i of e)i._$AO?.(t,false),s(i,t);return  true},o$2=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t;}while(0===e?.size)},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),c(t);}};function h(i){ void 0!==this._$AN?(o$2(this),this._$AM=i,r(this)):this._$AM=i;}function n$2(i,t=false,e=0){const r=this._$AH,h=this._$AN;if(void 0!==h&&0!==h.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s(r[i],false),o$2(r[i]);else null!=r&&(s(r,false),o$2(r));else s(this,i);}const c=i=>{i.type==t.CHILD&&(i._$AP??=n$2,i._$AQ??=h);};class f extends i{constructor(){super(...arguments),this._$AN=void 0;}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU;}_$AO(i,t=true){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(s(this,i),o$2(this));}setValue(t){if(f$1(this._$Ct))this._$Ct._$AI(t,this);else {const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0);}}disconnected(){}reconnected(){}}

const includes = Array.prototype.includes;
const partToScheduler = new WeakMap();
const schedulerToPart = new WeakMap();
class Scheduler extends BaseScheduler {
    args;
    setValue;
    constructor(renderer, part, setValue) {
        super(renderer, part);
        this.state.virtual = true;
        this.setValue = setValue;
    }
    render() {
        return this.state.run(() => this.renderer.apply(this.host, this.args));
    }
    commit(result) {
        this.setValue(result);
    }
    teardown() {
        super.teardown();
        let part = schedulerToPart.get(this);
        partToScheduler.delete(part);
    }
}
function makeVirtual() {
    function virtual(renderer) {
        class VirtualDirective extends f {
            cont;
            constructor(partInfo) {
                super(partInfo);
                this.cont = undefined;
            }
            update(part, args) {
                this.cont = partToScheduler.get(part);
                if (!this.cont || this.cont.renderer !== renderer) {
                    this.cont = new Scheduler(renderer, part, (r) => {
                        this.setValue(r);
                    });
                    partToScheduler.set(part, this.cont);
                    schedulerToPart.set(this.cont, part);
                    teardownOnRemove(this.cont, part);
                }
                this.cont.args = args;
                this.cont.update();
                return this.render(...args);
            }
            render(...args) {
                return w;
            }
        }
        return e(VirtualDirective);
    }
    return virtual;
}
function teardownOnRemove(cont, part, node = part.startNode) {
    let frag = node.parentNode;
    let mo = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (includes.call(mutation.removedNodes, node)) {
                mo.disconnect();
                if (node.parentNode instanceof ShadowRoot) {
                    teardownOnRemove(cont, part);
                }
                else {
                    cont.teardown();
                }
                break;
            }
            else if (includes.call(mutation.addedNodes, node.nextSibling)) {
                mo.disconnect();
                teardownOnRemove(cont, part, node.nextSibling || undefined);
                break;
            }
        }
    });
    mo.observe(frag, { childList: true });
}

const { component} = pion({ render: j });
const virtual = makeVirtual();

hook(class extends Hook {
    update() {
        return this.state.host;
    }
});

const UPPER = /([A-Z])/gu;
/* Emulate polymer notify props */
const notifyProperty = (host, name, value) => {
    // this is required to make polymer double-binding recognize the change
    // @see https://github.com/Polymer/polymer/blob/76c71e186ecc605294c3575dd31ac7983a8b3ae3/lib/mixins/property-effects.js#L382
    host[name] = value;
    // emulate polymer notify event
    host.dispatchEvent(new CustomEvent(name.replace(UPPER, '-$1').toLowerCase() + '-changed', {
        detail: { value },
    }));
};

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=e(class extends i{constructor(r){if(super(r),r.type!==t.PROPERTY&&r.type!==t.ATTRIBUTE&&r.type!==t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!f$1(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t$1]){if(t$1===w||t$1===T)return t$1;const o=i.element,l=i.name;if(i.type===t.PROPERTY){if(t$1===o[l])return w}else if(i.type===t.BOOLEAN_ATTRIBUTE){if(!!t$1===o.hasAttribute(l))return w}else if(i.type===t.ATTRIBUTE&&o.getAttribute(l)===t$1+"")return w;return m(i),t$1}});

const o$1=new WeakMap,n$1=e(class extends f{render(i){return T}update(i,[s]){const e=s!==this.Y;return e&&void 0!==this.Y&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.Y=s,this.ht=i.options?.host,this.rt(this.ct=i.element)),T}rt(t){if("function"==typeof this.Y){const i=this.ht??globalThis;let s=o$1.get(i);void 0===s&&(s=new WeakMap,o$1.set(i,s)),void 0!==s.get(this.Y)&&this.Y.call(this.ht,void 0),s.set(this.Y,t),void 0!==t&&this.Y.call(this.ht,t);}else this.Y.value=t;}get lt(){return "function"==typeof this.Y?o$1.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0);}reconnected(){this.rt(this.ct);}});

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o=o=>o??T;

const useImperativeApi = hook(class extends Hook {
    values;
    constructor(id, state, api, values) {
        super(id, state);
        Object.assign(state.host, api);
        this.values = values;
    }
    update(api, values) {
        if (this.hasChanged(values)) {
            this.values = values;
            Object.assign(this.state.host, api);
        }
    }
    hasChanged(values = []) {
        return values.some((value, i) => this.values[i] !== value);
    }
});

const useInput = (host) => {
    const inputRef = useRef(undefined);
    const onRef = useCallback((el) => (inputRef.current = el), []);
    const root = host.shadowRoot, onChange = useCallback((e) => host.dispatchEvent(new Event(e.type, { bubbles: e.bubbles })), []), onInput = useCallback((e) => notifyProperty(host, 'value', e.target.value), []), onFocus = useCallback((e) => notifyProperty(host, 'focused', e.type === 'focus'), []), focus = useCallback(() => inputRef.current?.focus(), []), validate = useCallback(() => {
        const valid = inputRef.current?.checkValidity();
        host.toggleAttribute('invalid', !valid);
        return valid;
    }, []);
    useImperativeApi({ focus, validate }, [focus, validate]);
    useEffect(() => {
        const onMouseDown = (e) => {
            if (e.defaultPrevented ||
                host.disabled ||
                e.target.matches('input, textarea, label')) {
                return;
            }
            e.preventDefault(); // don't blur
            if (!host.matches(':focus-within')) {
                // if input not focused
                focus(); // focus input
            }
        };
        root.addEventListener('mousedown', onMouseDown);
        return () => root.removeEventListener('mousedown', onMouseDown);
    }, [focus]);
    return {
        onChange,
        onFocus,
        onInput,
        onRef,
    };
};

const useAllowedPattern = (allowedPattern) => useMemo(() => {
    if (allowedPattern == null) {
        return;
    }
    const regexp = new RegExp(allowedPattern, 'u');
    return (e) => {
        if (!e.defaultPrevented && e.data && !regexp.test(e.data)) {
            e.preventDefault();
        }
    };
}, [allowedPattern]);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function n(n,r,t){return n?r(n):t?.(n)}

const tagged = (strings, ...values) => strings.flatMap((s, i) => [s, values[i] || '']).join('');

const styles = tagged `
	:host {
		--font-family: var(
			--cosmoz-input-font-family,
			var(--paper-font-subhead_-_font-family, inherit)
		);
		--font-size: var(
			--cosmoz-input-font-size,
			var(--paper-font-subhead_-_font-size, 16px)
		);
		--line-height: var(
			--cosmoz-input-line-height,
			var(--paper-font-subhead_-_line-height, 24px)
		);
		--label-scale: var(--cosmoz-input-label-scale, 0.75);
		--disabled-opacity: var(
			--cosmoz-input-disabled-opacity,
			var(--paper-input-container-disabled_-_opacity, 0.33)
		);
		--disabled-line-opacity: var(
			--cosmoz-input-disabled-line-opacity,
			var(--paper-input-container-underline-disabled_-_opacity, 1)
		);
		--invalid-color: var(
			--cosmoz-input-invalid-color,
			var(--paper-input-container-invalid-color, var(--error-color, #fc5c5b))
		);
		--bg: var(--cosmoz-input-background);
		--focused-bg: var(--cosmoz-input-focused-background, var(--bg));
		--color: var(--cosmoz-input-color, var(--secondary-text-color, #737373));
		--line-color: var(--cosmoz-input-line-color, var(--color));
		--focused-color: var(
			--cosmoz-input-focused-color,
			var(--primary-color, #3f51b5)
		);
		--float-display: var(--cosmoz-input-float-display, block);
		--contour-color: var(--line-color);
		--contour-size: var(--cosmoz-input-contour-size);
		--label-translate-y: var(--cosmoz-input-label-translate-y, 0%);

		display: block;
		padding: var(--cosmoz-input-padding, 8px 0);
		position: relative;
		transition: transform 0.25s, width 0.25s;
		transform-origin: left top;
		max-height: var(--cosmoz-input-max-height);
		font-size: var(--font-size);
		line-height: var(--line-height);
		font-family: var(--font-family);
	}

	:host([disabled]) {
		opacity: var(--disabled-opacity);
	}

	.float {
		line-height: calc(var(--line-height) * var(--label-scale));
		background-color: var(--cosmoz-input-float-bg-color, none);
		display: var(--float-display);
	}

	.wrap {
		padding: var(--cosmoz-input-wrap-padding, 0px);
		display: flex;
		align-items: center;
		position: relative;
		background: var(--bg);
		opacity: var(--cosmoz-input-opacity);
		border-radius: var(--cosmoz-input-border-radius);
		box-shadow: 0 0 0 var(--contour-size) var(--contour-color);
	}

	.control {
		flex: 1;
		position: relative;
	}

	#input {
		padding: 0;
		margin: 0;
		outline: none;
		border: none;
		width: 100%;
		max-width: 100%;
		display: block;
		background: transparent;
		line-height: inherit;
		font-size: inherit;
		font-family: inherit;
		resize: none;
	}

	:host(:focus-within) .wrap {
		background: var(--focused-bg);
	}

	label {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--cosmoz-input-label-width, 100%);
		transition: transform 0.25s, width 0.25s;
		transform-origin: left top;
		color: var(--color);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-transform: var(--cosmoz-input-label-text-transform);
		font-weight: var(--cosmoz-input-label-font-weight);
	}
	.wrap:has(#input:not(:placeholder-shown)) slot[name='suffix']::slotted(*),
	.wrap:has(#input:not(:placeholder-shown)) slot[name='prefix']::slotted(*) {
		transform: translateY(var(--label-translate-y));
	}
	:host([always-float-label]) label,
	#input:not(:placeholder-shown) + label {
		transform: translateY(
				calc(var(--label-scale) * -100% + var(--label-translate-y))
			)
			scale(var(--label-scale));
		background-color: var(--cosmoz-input-floating-label-bg, var(--bg));
	}

	:host([always-float-label]) input,
	#input:not(:placeholder-shown) {
		transform: translateY(var(--label-translate-y));
	}

	:host([always-float-label]) slot[name='suffix']::slotted(*),
	:host([always-float-label]) slot[name='prefix']::slotted(*) {
		transform: translateY(var(--label-translate-y));
	}

	:host(:not(always-float-label):focus-within) #input::placeholder,
	:host(:focus-within) label {
		color: var(--focused-color);
		opacity: 1;
	}

	.line {
		padding-top: 1px;
		border-bottom: 1px solid var(--line-color);
		position: relative;
		display: var(--cosmoz-input-line-display, block);
	}
	.line::before {
		content: '';
		position: absolute;
		border-bottom: 2px solid transparent;
		border-bottom-color: inherit;
		left: 0;
		right: 0;
		top: 0;
		transform: scale3d(0, 1, 1);
		transform-origin: center center;
		z-index: 1;
	}
	:host(:focus-within) .line::before {
		transform: none;
		transition: 0.25s transform ease;
	}
	:host(:focus-within) .line {
		border-bottom-color: var(--focused-color);
	}

	:host(:focus-within) {
		--contour-color: var(--focused-color);
		caret-color: var(--focused-color);
	}

	:host([disabled]) .line {
		border-bottom-style: dashed;
		opacity: var(--disabled-line-opacity);
	}

	:host([no-label-float]) .float,
	:host([no-label-float]) label {
		display: none;
	}

	.error {
		font-size: 12px;
		line-height: 20px;
		overflow: hidden;
		text-overflow: clip;
		position: absolute;
		max-width: 100%;
	}

	:host([invalid]) {
		--contour-color: var(--invalid-color);
		caret-color: var(--invalid-color);
	}

	:host([invalid]) label,
	.error {
		color: var(--invalid-color);
	}
	:host([invalid]) .line {
		border-bottom-color: var(--invalid-color);
	}

	#input::-webkit-inner-spin-button {
		z-index: 1;
	}

	:host([no-spinner]) #input::-webkit-inner-spin-button {
		display: none;
	}
	:host([no-spinner]) #input {
		-moz-appearence: textfield;
	}

	:host([autosize]) {
		width: min-content;
	}
	:host([autosize]) #input {
		min-width: 2ch;
		width: var(--chars);
	}
	:host([autosize]) .control {
		max-width: 100%;
	}

	:host([autosize][type='number']) #input {
		--width: calc(var(--chars) + 0.25em);
	}
	:host([autosize][type='number']:not([no-spinner])) #input {
		width: calc(var(--width) + 15px);
		min-width: calc(2ch + 0.25em + 15px);
	}
	:host([autosize][type='number'][no-spinner]) #input {
		width: var(--width);
		min-width: calc(2ch + 0.25em);
	}
	:host([type='color']) .line {
		display: none;
	}
`;

const render = (control, { label, invalid, errorMessage }) => x `
		<style>
			${styles}
		</style>
		<div class="float" part="float">&nbsp;</div>
		<div class="wrap" part="wrap">
			<slot name="prefix"></slot>
			<div class="control" part="control">
				<slot name="control"></slot>
				${control}
				${n(label, () => x `<label for="input" part="label">${label}</label>`)}
			</div>
			<slot name="suffix"></slot>
		</div>
		<div class="line" part="line"></div>
		${n(invalid && errorMessage, () => x `<div class="error" part="error">${errorMessage}</div>`)}
	`, attributes = [
    'autocomplete',
    'readonly',
    'disabled',
    'maxlength',
    'invalid',
    'no-label-float',
    'always-float-label',
];

const getPlaceholder = ({ placeholder, noLabelFloat, label }) => {
    return (noLabelFloat ? label : undefined) || placeholder || ' ';
};

const observedAttributes$1 = [
    'type',
    'pattern',
    'allowed-pattern',
    'min',
    'max',
    'step',
    'autosize',
    'label',
    ...attributes,
];
const Input = (host) => {
    const { type = 'text', pattern, allowedPattern, autocomplete, value, readonly, disabled, min, max, step, maxlength, } = host, { onChange, onFocus, onInput, onRef } = useInput(host);
    const onBeforeInput = useAllowedPattern(allowedPattern);
    return render(x `
			<input
				${n$1(onRef)}
				style="--chars: ${value?.toString()?.length ?? 0}ch"
				id="input"
				part="input"
				type=${type}
				pattern=${o(pattern)}
				autocomplete=${o(autocomplete)}
				placeholder=${getPlaceholder(host)}
				?readonly=${readonly}
				?aria-disabled=${disabled}
				?disabled=${disabled}
				.value=${l(value ?? '')}
				maxlength=${o(maxlength)}
				@beforeinput=${onBeforeInput}
				@input=${onInput}
				@change=${onChange}
				@focus=${onFocus}
				@blur=${onFocus}
				min=${o(min)}
				max=${o(max)}
				step=${o(step)}
			/>
		`, host);
};
customElements.define('cosmoz-input', component(Input, { observedAttributes: observedAttributes$1 }));

const autoheight = (input) => {
    input.style.height = '';
    input.style.height = `${input.scrollHeight}px`;
};
const limit = (input, maxRows = 0) => {
    if (maxRows > 0) {
        const rows = input.getAttribute('rows') ?? '', height = input.style.height;
        input.style.height = '';
        input.setAttribute('rows', maxRows);
        input.style.maxHeight = input.getBoundingClientRect().height + 'px';
        input.style.height = height;
        input.setAttribute('rows', rows);
    }
};
const useAutoHeight = (host) => {
    const { value, maxRows } = host, input = useMemo(() => () => host.shadowRoot.querySelector('#input'), []);
    useEffect(() => limit(input(), maxRows), [maxRows, input]);
    useEffect(() => autoheight(input()), [input, value]);
    useEffect(() => {
        const el = input(), observer = new ResizeObserver(() => requestAnimationFrame(() => autoheight(el)));
        observer.observe(el);
        return () => observer.unobserve(el);
    }, [input]);
};

const observedAttributes = ['rows', ...attributes];
const Textarea = (host) => {
    const { autocomplete, value, placeholder, readonly, disabled, rows, cols, maxlength, } = host, { onChange, onFocus, onInput, onRef } = useInput(host);
    useAutoHeight(host);
    return render(x `
			<textarea id="input" part="input"
				${n$1(onRef)}
				autocomplete=${o(autocomplete)}
				placeholder=${placeholder || ' '}
				rows=${rows ?? 1} cols=${o(cols)}
				?readonly=${readonly} ?aria-disabled=${disabled} ?disabled=${disabled}
				.value=${l(value ?? '')} maxlength=${o(maxlength)} @input=${onInput}
				@change=${onChange} @focus=${onFocus} @blur=${onFocus}>`, host);
};
customElements.define('cosmoz-textarea', component(Textarea, { observedAttributes }));

const separators = ["T", " "];
const getDateTimeParts = (aDateTime) => {
  if (!aDateTime || typeof aDateTime !== "string") {
    return;
  }
  let parts;
  separators.some((split) => {
    if (!aDateTime.match(split)) {
      return false;
    }
    parts = aDateTime.split(split);
    return true;
  });
  return parts || [aDateTime];
};
const getMinMax = (min, max) => {
  const minParts = getDateTimeParts(min), maxParts = getDateTimeParts(max);
  return {
    minDate: Array.isArray(minParts) ? minParts.shift() : null,
    minTime: Array.isArray(minParts) ? minParts.shift() : null,
    maxDate: Array.isArray(maxParts) ? maxParts.shift() : null,
    maxTime: Array.isArray(maxParts) ? maxParts.shift() : null
  };
};
const toValue = (date, time) => {
  if (!date && !time) {
    return;
  }
  if (!date && time) {
    return `T${time}`;
  }
  if (date && !time) {
    return date;
  }
  return `${date}T${time}`;
};
const fromValue = (value) => {
  if (!value) {
    return;
  }
  for (const split of separators) {
    if (value.match(split)) {
      const parts = value.split(split);
      return {
        date: parts.shift(),
        time: parts.shift()
      };
    }
  }
  return { date: value };
};
const DateTimeInput = (host) => {
  const { dateLabel, timeLabel, min, max, step = "1", value } = host;
  const { minDate, maxDate, minTime, maxTime } = useMemo(
    () => getMinMax(min, max),
    [min, max]
  );
  const { date, time } = useMemo(() => fromValue(value) ?? {}, [value]);
  useEffect(() => {
    host.dispatchEvent(
      new CustomEvent("cosmoz-datetime-input-value-changed", {
        bubbles: true,
        composed: true
      })
    );
  }, [value]);
  return x`
		<style>
			:host {
				display: flex;
				flex-direction: row;
			}
		</style>
		<cosmoz-input
			label="${dateLabel}"
			type="date"
			.value="${date}"
			@value-changed="${(e) => notifyProperty(host, "value", toValue(e.target.value, time))}"
			.min="${minDate}"
			.max="${maxDate}"
		></cosmoz-input>
		<cosmoz-input
			label="${timeLabel}"
			type="time"
			.value="${time}"
			@value-changed="${(e) => notifyProperty(host, "value", toValue(date, e.target.value))}"
			step="${step}"
			.min="${minTime}"
			.max="${maxTime}"
		></cosmoz-input>
	`;
};
customElements.define(
  "cosmoz-datetime-input",
  component(DateTimeInput, {
    observedAttributes: ["date-label", "time-label", "min", "max", "step"]
  })
);

var cosmozDatetimeInput_stories = {
  title: "Datetime Input",
  component: "cosmoz-datetime-input"
};
const state = virtual((render) => {
  const [value, setValue] = useState("2019-10-02T12:33:59");
  return render({
    value,
    setValue
  });
});
const basic = () => x`${state(
  ({ value, setValue }) => x`
			<cosmoz-datetime-input
				date-label="Date label"
				time-label="Time Label"
				.value=${value}
				@value-changed=${(e) => setValue(e.target.value)}
			></cosmoz-datetime-input>
			<div>
				<p>Date: ${fromValue(value)?.date}</p>
				<p>Time: ${fromValue(value)?.time}</p>
				<p>Value: ${value}</p>
			</div>
		`
)}`;
const minMax = () => x`${state(
  ({ value, setValue }) => x`
			<cosmoz-datetime-input
				date-label="Date label"
				time-label="Time Label"
				min="2019-10-01T12:00:00"
				max="2019-10-07T14:00:00"
				.value=${value}
				@value-changed=${(e) => setValue(e.target.value)}
			></cosmoz-datetime-input>
			<div>
				<p>Date: ${fromValue(value)?.date}</p>
				<p>Time: ${fromValue(value)?.time}</p>
				<p>Min: 2019-10-01T12:00:00</p>
				<p>Max: 2019-10-07T14:00:00</p>
				<input .value="${value}" @input="${(e) => setValue(e.target.value)}" />
			</div>
		`
)}`;
const __namedExportsOrder = ["basic", "minMax"];

export { __namedExportsOrder, basic, cosmozDatetimeInput_stories as default, minMax };
