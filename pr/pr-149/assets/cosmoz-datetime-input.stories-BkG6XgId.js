var qt=Object.defineProperty;var Gt=(e,t,o)=>t in e?qt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var a=(e,t,o)=>Gt(e,typeof t!="symbol"?t+"":t,o);import{r as Tt,E as N,D as Ct,A as F,p as Yt,w as Qt,b as p}from"./iframe-CCOYPlnd.js";import"./preload-helper-C1FmrZbK.js";let Y,St=0;function lt(e){Y=e}function ct(){Y=null,St=0}function Wt(){return St++}const J=Symbol("haunted.phase"),G=Symbol("haunted.hook"),ut=Symbol("haunted.update"),dt=Symbol("haunted.commit"),L=Symbol("haunted.effects"),D=Symbol("haunted.layoutEffects"),X="haunted.context";var gt,yt,wt;wt=G,yt=L,gt=D;class Zt{constructor(t,o){a(this,"update");a(this,"host");a(this,"virtual");a(this,wt);a(this,yt);a(this,gt);this.update=t,this.host=o,this[G]=new Map,this[L]=[],this[D]=[]}run(t){lt(this);let o=t();return ct(),o}_runEffects(t){let o=this[t];lt(this);for(let s of o)s.call(this);ct()}runEffects(){this._runEffects(L)}runLayoutEffects(){this._runEffects(D)}teardown(){this[G].forEach(o=>{typeof o.teardown=="function"&&o.teardown(!0)})}}const Jt=Promise.resolve().then.bind(Promise.resolve());function Pt(){let e=[],t;function o(){t=null;let s=e;e=[];for(var n=0,r=s.length;n<r;n++)s[n]()}return function(s){e.push(s),t==null&&(t=Jt(o))}}const Kt=Pt(),ht=Pt();var zt;zt=J;class Rt{constructor(t,o){a(this,"renderer");a(this,"host");a(this,"state");a(this,zt);a(this,"_updateQueued");a(this,"_active");this.renderer=t,this.host=o,this.state=new Zt(this.update.bind(this),o),this[J]=null,this._updateQueued=!1,this._active=!1}update(){this._active&&(this._updateQueued||(Kt(()=>{let t=this.handlePhase(ut);ht(()=>{this.handlePhase(dt,t),ht(()=>{this.handlePhase(L)})}),this._updateQueued=!1}),this._updateQueued=!0))}handlePhase(t,o){switch(this[J]=t,t){case dt:this.commit(o),this.runEffects(D);return;case ut:return this.render();case L:return this.runEffects(L)}}render(){return this.state.run(()=>this.renderer.call(this.host,this.host))}runEffects(t){this.state._runEffects(t)}teardown(){this.state.teardown()}pause(){this._active=!1}resume(){this._active=!0}}const j=(...e)=>{const t=new CSSStyleSheet;return t.replaceSync(e.join("")),t},Xt=e=>e==null?void 0:e.map(t=>typeof t=="string"?j(t):t),te=(e,...t)=>e.flatMap((o,s)=>[o,t[s]||""]).join(""),O=te,ee=(e="")=>e.replace(/-+([a-z])?/g,(t,o)=>o?o.toUpperCase():"");function oe(e){class t extends Rt{constructor(r,l,d){super(r,d||l);a(this,"frag");a(this,"renderResult");this.frag=l}commit(r){this.renderResult=e(r,this.frag)}}function o(s,n,r){const l=(r||n||{}).baseElement||HTMLElement,{observedAttributes:d=[],useShadowDOM:c=!0,shadowRootInit:u={},styleSheets:f}=r||n||{},i=Xt(s.styleSheets||f);class m extends l{constructor(){super();a(this,"_scheduler");if(c===!1)this._scheduler=new t(s,this);else{const h=this.attachShadow({mode:"open",...u});i&&(h.adoptedStyleSheets=i),this._scheduler=new t(s,h,this)}}static get observedAttributes(){return s.observedAttributes||d||[]}connectedCallback(){var h;this._scheduler.resume(),this._scheduler.update(),(h=this._scheduler.renderResult)==null||h.setConnected(!0)}disconnectedCallback(){var h;this._scheduler.pause(),this._scheduler.teardown(),(h=this._scheduler.renderResult)==null||h.setConnected(!1)}attributeChangedCallback(h,g,b){if(g===b)return;let B=b===""?!0:b;Reflect.set(this,ee(h),B)}}function y(w){let v=w,h=!1;return Object.freeze({enumerable:!0,configurable:!0,get(){return v},set(g){h&&v===g||(h=!0,v=g,this._scheduler&&this._scheduler.update())}})}const k=new Proxy(l.prototype,{getPrototypeOf(w){return w},set(w,v,h,g){let b;return v in w?(b=Object.getOwnPropertyDescriptor(w,v),b&&b.set?(b.set.call(g,h),!0):(Reflect.set(w,v,h,g),!0)):(typeof v=="symbol"||v[0]==="_"?b={enumerable:!0,configurable:!0,writable:!0,value:h}:b=y(h),Object.defineProperty(g,v,b),b.set&&b.set.call(g,h),!0)}});return Object.setPrototypeOf(m.prototype,k),m}return o}class C{constructor(t,o){a(this,"id");a(this,"state");this.id=t,this.state=o}}function se(e,...t){let o=Wt(),s=Y[G],n=s.get(o);return n||(n=new e(o,Y,...t),s.set(o,n)),n.update(...t)}function S(e){return se.bind(null,e)}function Lt(e){return S(class extends C{constructor(o,s,n,r){super(o,s);a(this,"callback");a(this,"lastValues");a(this,"values");a(this,"_teardown");e(s,this)}update(o,s){this.callback=o,this.values=s}call(){const o=!this.values||this.hasChanged();this.lastValues=this.values,o&&this.run()}run(){this.teardown(),this._teardown=this.callback.call(this.state)}teardown(o){typeof this._teardown=="function"&&(this._teardown(),this._teardown=void 0),o&&(this.lastValues=this.values=void 0)}hasChanged(){return!this.lastValues||this.values.some((o,s)=>this.lastValues[s]!==o)}})}function Mt(e,t){e[L].push(t)}const A=Lt(Mt),ne=e=>e instanceof Element?e:e.startNode||e.endNode||e.parentNode,re=S(class extends C{constructor(t,o,s){super(t,o);a(this,"Context");a(this,"value");a(this,"_ranEffect");a(this,"_unsubscribe");this._updater=this._updater.bind(this),this._ranEffect=!1,this._unsubscribe=null,Mt(o,this)}update(t){return this.Context!==t&&(this._subscribe(t),this.Context=t),this.value}call(){this._ranEffect||(this._ranEffect=!0,this._unsubscribe&&this._unsubscribe(),this._subscribe(this.Context),this.state.update())}_updater(t){this.value=t,this.state.update()}_subscribe(t){const o={Context:t,callback:this._updater};ne(this.state.host).dispatchEvent(new CustomEvent(X,{detail:o,bubbles:!0,cancelable:!0,composed:!0}));const{unsubscribe:n=null,value:r}=o;this.value=n?r:t.defaultValue,this._unsubscribe=n}teardown(){this._unsubscribe&&this._unsubscribe()}});function ie(e){return t=>{const o={Provider:class extends HTMLElement{constructor(){super();a(this,"listeners");a(this,"_value");this.style.display="contents",this.listeners=new Set,this.addEventListener(X,this)}disconnectedCallback(){this.removeEventListener(X,this)}handleEvent(n){const{detail:r}=n;r.Context===o&&(r.value=this.value,r.unsubscribe=this.unsubscribe.bind(this,r.callback),this.listeners.add(r.callback),n.stopPropagation())}unsubscribe(n){this.listeners.delete(n)}set value(n){this._value=n;for(let r of this.listeners)r(n)}get value(){return this._value}},Consumer:e(function({render:s}){const n=re(o);return s(n)},{useShadowDOM:!1}),defaultValue:t};return o}}const M=S(class extends C{constructor(t,o,s,n){super(t,o);a(this,"value");a(this,"values");this.value=s(),this.values=n}update(t,o){return this.hasChanged(o)&&(this.values=o,this.value=t()),this.value}hasChanged(t=[]){return t.some((o,s)=>this.values[s]!==o)}}),P=(e,t)=>M(()=>e,t);function ae(e,t){e[D].push(t)}Lt(ae);const le=S(class extends C{constructor(t,o,s){super(t,o);a(this,"args");this.updater=this.updater.bind(this),typeof s=="function"&&(s=s()),this.makeArgs(s)}update(){return this.args}updater(t){const[o]=this.args;typeof t=="function"&&(t=t(o)),!Object.is(o,t)&&(this.makeArgs(t),this.state.update())}makeArgs(t){this.args=Object.freeze([t,this.updater])}});S(class extends C{constructor(t,o,s,n,r){super(t,o);a(this,"reducer");a(this,"currentState");this.dispatch=this.dispatch.bind(this),this.currentState=r!==void 0?r(n):n}update(t){return this.reducer=t,[this.currentState,this.dispatch]}dispatch(t){this.currentState=this.reducer(this.currentState,t),this.state.update()}});const ce=/([A-Z])/gu;S(class extends C{constructor(t,o,s,n){super(t,o);a(this,"property");a(this,"eventName");if(this.state.virtual)throw new Error("Can't be used with virtual components.");this.updater=this.updater.bind(this),this.property=s,this.eventName=s.replace(ce,"-$1").toLowerCase()+"-changed",this.state.host[this.property]==null&&(typeof n=="function"&&(n=n()),n!=null&&this.updateProp(n))}update(t,o){return[this.state.host[this.property],this.updater]}updater(t){const o=this.state.host[this.property];typeof t=="function"&&(t=t(o)),!Object.is(o,t)&&this.updateProp(t)}updateProp(t){this.notify(t).defaultPrevented||(this.state.host[this.property]=t)}notify(t){const o=new CustomEvent(this.eventName,{detail:{value:t,path:this.property},cancelable:!0});return this.state.host.dispatchEvent(o),o}});function ue(e){let t=e;return{get current(){return t},set current(o){t=o},get value(){return t},set value(o){t=o}}}function Q(e){return M(()=>ue(e),[])}S(class extends C{update(){return this.state.host}});function de({render:e}){const t=oe(e),o=ie(t);return{component:t,createContext:o}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},st=e=>(...t)=>({_$litDirective$:e,values:t});class Ot{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,s){this._$Ct=t,this._$AM=o,this._$Ci=s}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const V=(e,t)=>{var s;const o=e._$AN;if(o===void 0)return!1;for(const n of o)(s=n._$AO)==null||s.call(n,t,!1),V(n,t);return!0},W=e=>{let t,o;do{if((t=e._$AM)===void 0)break;o=t._$AN,o.delete(e),e=t}while((o==null?void 0:o.size)===0)},It=e=>{for(let t;t=e._$AM;e=t){let o=t._$AN;if(o===void 0)t._$AN=o=new Set;else if(o.has(e))break;o.add(e),fe(t)}};function he(e){this._$AN!==void 0?(W(this),this._$AM=e,It(this)):this._$AM=e}function pe(e,t=!1,o=0){const s=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(s))for(let r=o;r<s.length;r++)V(s[r],!1),W(s[r]);else s!=null&&(V(s,!1),W(s));else V(this,e)}const fe=e=>{e.type==R.CHILD&&(e._$AP??(e._$AP=pe),e._$AQ??(e._$AQ=he))};class Nt extends Ot{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,o,s){super._$AT(t,o,s),It(this),this.isConnected=t._$AU}_$AO(t,o=!0){var s,n;t!==this.isConnected&&(this.isConnected=t,t?(s=this.reconnected)==null||s.call(this):(n=this.disconnected)==null||n.call(this)),o&&(V(this,t),W(this))}setValue(t){if(Tt(this._$Ct))this._$Ct._$AI(t,this);else{const o=[...this._$Ct._$AH];o[this._$Ci]=t,this._$Ct._$AI(o,this,0)}}disconnected(){}reconnected(){}}const pt=Array.prototype.includes,tt=new WeakMap,Dt=new WeakMap;class me extends Rt{constructor(o,s,n){super(o,s);a(this,"args");a(this,"setValue");this.state.virtual=!0,this.setValue=n}render(){return this.state.run(()=>this.renderer.apply(this.host,this.args))}commit(o){this.setValue(o)}teardown(){super.teardown();let o=Dt.get(this);tt.delete(o)}}function ve(){function e(t){class o extends Nt{constructor(r){super(r);a(this,"cont");this.cont=void 0}update(r,l){return this.cont=tt.get(r),(!this.cont||this.cont.renderer!==t)&&(this.cont=new me(t,r,d=>{this.setValue(d)}),tt.set(r,this.cont),Dt.set(this.cont,r),et(this.cont,r)),this.cont.args=l,this.cont.resume(),this.cont.update(),this.render(...l)}render(...r){return N}}return st(o)}return e}function et(e,t,o=t.startNode){let s=o.parentNode,n=new MutationObserver(r=>{for(let l of r)if(pt.call(l.removedNodes,o)){n.disconnect(),o.parentNode instanceof ShadowRoot?et(e,t):e.teardown();break}else if(pt.call(l.addedNodes,o.nextSibling)){n.disconnect(),et(e,t,o.nextSibling||void 0);break}});n.observe(s,{childList:!0})}const{component:I}=de({render:Ct}),be=ve();/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _=e=>e??F;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nt=st(class extends Ot{constructor(e){if(super(e),e.type!==R.PROPERTY&&e.type!==R.ATTRIBUTE&&e.type!==R.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Tt(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===N||t===F)return t;const o=e.element,s=e.name;if(e.type===R.PROPERTY){if(t===o[s])return N}else if(e.type===R.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(s))return N}else if(e.type===R.ATTRIBUTE&&o.getAttribute(s)===t+"")return N;return Yt(e),t}}),K=new WeakMap,rt=st(class extends Nt{render(e){return F}update(e,[t]){var s;const o=t!==this.G;return o&&this.G!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.G=t,this.ht=(s=e.options)==null?void 0:s.host,this.rt(this.ct=e.element)),F}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let o=K.get(t);o===void 0&&(o=new WeakMap,K.set(t,o)),o.get(this.G)!==void 0&&this.G.call(this.ht,void 0),o.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){var e,t;return typeof this.G=="function"?(e=K.get(this.ht??globalThis))==null?void 0:e.get(this.G):(t=this.G)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function z(e,t,o){return e?t(e):o==null?void 0:o(e)}const ge=({slot:e,title:t,className:o,width:s="24",height:n="24",styles:r}={})=>p`
  <svg
    slot=${_(e)}
    class=${`info-circle-icon ${o??""}`}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    width=${s}
    height=${n}
    style=${_(r)}
  >
    ${z(t,()=>Qt`<title>${t}</title>`)}
    <path
      d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
    />
  </svg>
`,it=j(O`
	/*
	 * Use border-box sizing for all elements.
	 * This is safe and doesn't conflict with child component styles.
	 */
	*,
	::before,
	::after,
	::backdrop,
	::file-selector-button {
		box-sizing: border-box;
	}

	/*
	 * Reset margins and padding on elements that typically have browser defaults.
	 * This is more targeted than using * to avoid affecting custom elements.
	 */
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	blockquote,
	pre,
	ul,
	ol,
	li,
	dl,
	dt,
	dd,
	figure,
	figcaption,
	fieldset,
	legend,
	form,
	hr,
	table,
	th,
	td {
		margin: 0;
		padding: 0;
	}

	/*
	 * Reset borders on elements that typically have them.
	 */
	fieldset,
	hr,
	iframe {
		border: 0 solid;
	}

	/*
	 * 1. Use a consistent sensible line-height in all browsers.
	 * 2. Prevent adjustments of font size after orientation changes in iOS.
	 * 3. Use a more readable tab size.
	 * 4. Use the configured font-family.
	 * 5. Disable tap highlights on iOS.
	 */
	:host {
		line-height: 1.5;
		-webkit-text-size-adjust: 100%;
		tab-size: 4;
		font-family: var(--cz-font-body);
		-webkit-tap-highlight-color: transparent;
	}

	/*
	 * Reset links to optimize for opt-in styling.
	 */
	a {
		color: inherit;
		text-decoration: inherit;
	}

	/*
	 * Add the correct font weight in Edge and Safari.
	 */
	b,
	strong {
		font-weight: bolder;
	}

	/*
	 * 1. Use the configured mono font-family.
	 * 2. Correct the odd em font sizing in all browsers.
	 */
	code,
	kbd,
	samp,
	pre {
		font-family: var(--cz-font-mono);
		font-size: 1em;
	}

	/*
	 * Add the correct font size in all browsers.
	 */
	small {
		font-size: 80%;
	}

	/*
	 * Prevent sub and sup from affecting line height.
	 */
	sub,
	sup {
		font-size: 75%;
		line-height: 0;
		position: relative;
		vertical-align: baseline;
	}

	sub {
		bottom: -0.25em;
	}

	sup {
		top: -0.5em;
	}

	/*
	 * 1. Make replaced elements display: block by default.
	 * 2. Add vertical-align: middle for better alignment.
	 */
	img,
	svg,
	video,
	canvas,
	audio,
	iframe,
	embed,
	object {
		display: block;
		vertical-align: middle;
	}

	/*
	 * Constrain images and videos to parent width.
	 */
	img,
	video {
		max-width: 100%;
		height: auto;
	}

	/*
	 * Reset form controls:
	 * 1. Inherit font styles in all browsers.
	 * 2. Remove default margins, padding, and borders.
	 * 3. Remove border radius.
	 * 4. Remove background color.
	 */
	button,
	input,
	select,
	optgroup,
	textarea,
	::file-selector-button {
		margin: 0;
		padding: 0;
		border: 0 solid;
		font: inherit;
		font-feature-settings: inherit;
		font-variation-settings: inherit;
		letter-spacing: inherit;
		color: inherit;
		border-radius: 0;
		background-color: transparent;
	}

	/*
	 * Reset placeholder opacity in Firefox.
	 */
	::placeholder {
		opacity: 1;
		color: var(--cz-color-text-placeholder, currentcolor);
	}

	/*
	 * Prevent horizontal textarea resize.
	 */
	textarea {
		resize: vertical;
	}

	/*
	 * Remove the inner padding in Chrome and Safari on macOS.
	 */
	::-webkit-search-decoration {
		-webkit-appearance: none;
	}

	/*
	 * Correct the inability to style the border radius in iOS Safari.
	 */
	button,
	input:where([type='button'], [type='reset'], [type='submit']),
	::file-selector-button {
		appearance: button;
	}

	/*
	 * Make elements with hidden attribute stay hidden.
	 */
	[hidden]:where(:not([hidden='until-found'])) {
		display: none !important;
	}
`),ye=O`
	:host {
		display: flex;
		flex-direction: column;
		gap: var(--cosmoz-tooltip-gap, var(--cz-spacing));
		font-family: var(--cz-font-body);
	}

	::slotted([slot='heading']) {
		display: block;
	}

	::slotted([slot='description']) {
		margin: 0;
	}
`;customElements.define("cosmoz-tooltip-content",I(()=>p`
			<slot name="heading"></slot>
			<slot name="description"></slot>
			<slot></slot>
		`,{styleSheets:[it,ye]}));const ot=j(O`
	.cosmoz-tooltip-popover {
		position: fixed;
		inset: unset;
		pointer-events: none;
		text-align: left;
		margin: calc(var(--cz-spacing) * 2);
		position-try-fallbacks:
			flip-block,
			flip-inline,
			flip-block flip-inline;

		/* Reset popover defaults */
		border: none;
		white-space: normal;
		padding: var(--cosmoz-tooltip-padding, calc(var(--cz-spacing) * 2) calc(var(--cz-spacing) * 3));
		border-radius: var(--cosmoz-tooltip-border-radius, var(--cz-radius-sm));
		max-width: var(--cosmoz-tooltips-max-width, 20rem);
		box-shadow: var(--cosmoz-tooltip-box-shadow, var(--cz-shadow-lg));
		background: var(--cosmoz-tooltip-bg-color, var(--cz-color-gray-900));
		font-size: var(--cosmoz-tooltip-font-size, var(--cz-text-xs));
		font-weight: var(--cosmoz-tooltip-font-weight, 400);
		line-height: var(--cosmoz-tooltip-line-height, var(--cz-text-xs-line-height));
		color: var(--cosmoz-tooltip-text-color, var(--cz-color-white));

		cosmoz-tooltip-content strong {
			font-weight: var(
	 			--cosmoz-tooltip-heading-font-weight,
	 			var(--cz-font-weight-semibold)
	 		);

			color: var(--cosmoz-tooltip-heading-color);
		}

		/* Animation - open state */
		opacity: 1;
		transform: translateY(0) scale(1);

		transition:
			opacity 150ms ease-out,
			transform 150ms ease-out,
			overlay 150ms ease-out allow-discrete,
			display 150ms ease-out allow-discrete;
	}

	@starting-style {
		.cosmoz-tooltip-popover:popover-open {
			opacity: 0;
			transform: translateY(4px) scale(0.96);
		}
	}

	.cosmoz-tooltip-popover:not(:popover-open) {
		opacity: 0;
		transform: translateY(4px) scale(0.96);
	}

	@media (prefers-reduced-motion: reduce) {
		.cosmoz-tooltip-popover {
			transition: none;
		}
	}
`),ft=(e,t,o)=>Ct(p`<cosmoz-tooltip-content>
			${z(t,()=>p`<strong slot="heading">${t}</strong>`)}
			${z(o,()=>p`<p slot="description">${o}</p>`)}
		</cosmoz-tooltip-content>`,e),we=(e,t)=>{const{for:o,heading:s,description:n,placement:r="top",delay:l=300,disabled:d=!1}=t,c=Q();A(()=>{if(!o)return;const u=e.getRootNode(),f=u.adoptedStyleSheets??[];f.includes(ot)||(u.adoptedStyleSheets=[...f,ot]);const i=document.createElement("div");i.setAttribute("popover","manual"),i.setAttribute("role","tooltip"),i.classList.add("cosmoz-tooltip-popover"),e.after(i),c.current=i,ft(i,s,n);const m=`[name="${o}"]`,y=`--tooltip-anchor-${o}`;let k;const w=E=>{d||(clearTimeout(k),E.style.anchorName=y,i.style.positionAnchor=y,i.style.positionArea=r,k=window.setTimeout(()=>i.showPopover(),l))},v=()=>{clearTimeout(k),i.hidePopover()},h=E=>{var x,$;const T=($=(x=E.target).closest)==null?void 0:$.call(x,m);T&&w(T)},g=E=>{var $,at;const T=(at=($=E.target).closest)==null?void 0:at.call($,m);if(!T)return;const x=E.relatedTarget;x&&T.contains(x)||v()},b=E=>{var x,$;const T=($=(x=E.target).closest)==null?void 0:$.call(x,m);T&&w(T)},B=E=>{var x,$;($=(x=E.target).closest)!=null&&$.call(x,m)&&v()};return u.addEventListener("pointerover",h),u.addEventListener("pointerout",g),u.addEventListener("focusin",b),u.addEventListener("focusout",B),()=>{clearTimeout(k),u.removeEventListener("pointerover",h),u.removeEventListener("pointerout",g),u.removeEventListener("focusin",b),u.removeEventListener("focusout",B),i.hidePopover(),i.remove(),c.current=void 0}},[o,r,l,d]),A(()=>{!o||!c.current||ft(c.current,s,n)},[s,n,o]),A(()=>{!d||!c.current||c.current.hidePopover()},[d])},ze=O`
	:host {
		display: inline-block;
		anchor-name: --tooltip-anchor;
	}

	:host([for]) {
		display: contents;
		anchor-name: unset;
	}

	.cosmoz-tooltip-popover {
		position-anchor: --tooltip-anchor;
	}
`,xe=e=>{const{heading:t,description:o,for:s,placement:n="top",delay:r=300,disabled:l=!1}=e,d=Q(),c=Q(),u=P(()=>{l||(clearTimeout(c.current),c.current=window.setTimeout(()=>{var i;(i=d.current)==null||i.showPopover()},r))},[r,l]);A(()=>{var i;l&&(clearTimeout(c.current),(i=d.current)==null||i.hidePopover())},[l]);const f=P(()=>{var i;clearTimeout(c.current),(i=d.current)==null||i.hidePopover()},[]);return A(()=>{if(s)return;const i=m=>{const y=m.relatedTarget;y&&e.contains(y)||f()};return e.addEventListener("pointerover",u),e.addEventListener("pointerout",i),()=>{e.removeEventListener("pointerover",u),e.removeEventListener("pointerout",i)}},[s,u,f]),we(e,{for:s,heading:t,description:o,placement:n,delay:r,disabled:l}),s?F:p`
		<slot @focusin=${u} @focusout=${f}></slot>
		<div
			class="cosmoz-tooltip-popover"
			popover="manual"
			role="tooltip"
			style="position-area: ${n}"
			${rt(i=>{d.current=i})}
		>
			<cosmoz-tooltip-content>
				${z(t,()=>p`<strong slot="heading">${t}</strong>`)}
				${z(o,()=>p`<p slot="description">${o}</p>`)}
				<slot name="content"></slot>
			</cosmoz-tooltip-content>
		</div>
	`};customElements.define("cosmoz-tooltip",I(xe,{styleSheets:[it,ot,ze],observedAttributes:["heading","description","for","placement","delay","disabled"]}));const Vt=(e,{hint:t,label:o,invalid:s,errorMessage:n,compact:r,required:l})=>p`
		<!-- label: hidden in compact mode -->
		${z(!r&&o,()=>p`<label for="input" part="label"
					>${o}
					${z(l,()=>p`<span class="required">*</span>`)}
				</label>`)}
		<div class="wrap" part="wrap">
			<slot name="prefix"></slot>
			<div class="control" part="control">
				<slot name="control"></slot>
				${e}
			</div>
			<!-- compact: tooltip always visible, red icon when invalid -->
			${z(r&&s&&n,()=>p`<cosmoz-tooltip
						placement="top"
						description=${n}
						delay="300"
					>
						${ge({width:"16px",height:"16px"})}
					</cosmoz-tooltip>`)}

			<slot name="suffix"></slot>
		</div>
		<!-- hint: visible when valid, hidden when invalid or compact -->
		${z(!r&&t&&!s,()=>p`<span class="hint" part="hint">${t}</span>`)}
		<!-- error: replaces hint when invalid, hidden in compact -->
		${z(!r&&s&&n,()=>p`<span class="error" part="error">${n}</span>`)}
	`,Ft=["autocomplete","readonly","disabled","maxlength","invalid"],$e=(e,...t)=>e.flatMap((o,s)=>[o,t[s]??""]).join(""),Ut=$e`
	/* === Host === */

	:host {
		display: flex;
		flex-direction: column;
		gap: calc(var(--cz-spacing) * 1.5);
		position: relative;
		font-size: var(--cz-text-base);
		line-height: var(--cz-text-base-line-height);
		font-family: var(--cz-font-body);
	}

	:host(:focus-within) {
		caret-color: var(--cz-color-text-primary);
	}

	:host([disabled]) .wrap {
		color: var(--cz-color-text-disabled);
		opacity: 0.5;
		cursor: not-allowed;
	}

	:host([disabled]) #input {
		cursor: not-allowed;
	}

	:host([invalid]) {
		caret-color: var(--cz-color-text-error);
	}

	:host([invalid]) .required,
	.error {
		color: var(--cz-color-text-error);
	}

	/* === Layout === */

	.wrap {
		display: flex;
		align-items: center;
		position: relative;
		width: 100%;
		border-radius: var(--cz-radius-md);
		box-shadow: 0 0 0 1px var(--cz-color-border-primary);
		overflow: hidden;
	}

	.wrap:has(#input:focus) {
		box-shadow: var(--cz-focus-ring);
	}

	:host([invalid]) .wrap {
		box-shadow: 0 0 0 1px var(--cz-color-border-error);
	}

	:host([invalid]) .wrap:has(#input:focus) {
		box-shadow: var(--cz-focus-ring-error);
	}

	.control {
		flex: 1;
		position: relative;
	}

	/* === Input === */

	#input {
		box-sizing: border-box;
		margin: 0;
		outline: none;
		border: none;
		width: 100%;
		display: block;
		background: transparent;
		line-height: inherit;
		font-size: inherit;
		font-family: inherit;
		resize: none;
		color: var(--cz-color-text-primary);
		padding-block: calc(var(--cz-spacing) * 2);
		padding-inline: calc(var(--cz-spacing) * 3);
	}

	#input::placeholder {
		color: var(--cz-color-text-placeholder);
	}

	#input::-webkit-inner-spin-button {
		z-index: 1;
	}

	/* === Label === */

	label {
		position: relative;
		font-size: var(--cz-text-sm);
		color: var(--cz-color-text-secondary);
	}

	/* === Hint & Error === */

	.hint {
		font-size: var(--cz-text-xs);
		color: var(--cz-color-text-tertiary);
	}

	.error {
		font-size: var(--cz-text-xs);
	}

	/* === Tooltip (fluid error indicator) === */

	cosmoz-tooltip {
		display: flex;
		align-items: center;
		margin-right: calc(var(--cz-spacing) * 2);
	}

	:host([invalid]) cosmoz-tooltip {
		color: var(--cz-color-text-error);
	}

	:host([variant='inline']) cosmoz-tooltip {
		display: none;
	}

	/* === Slots === */

	.wrap:has(#input:not(:placeholder-shown)) {
		slot[name='suffix']::slotted(*),
		slot[name='prefix']::slotted(*) {
			transform: translateY(var(--label-translate-y));
		}
	}

	/* === Variant: inline === */
	:host([variant='inline']) .wrap {
		margin-top: calc(var(--cz-spacing) * 2.5);
	}

	:host([variant='inline']) #input {
		padding-inline: 0;
	}

	:host([variant='inline']) #input::placeholder {
		color: transparent;
	}

	:host([variant='inline']) .wrap {
		border-radius: 0;
		box-shadow: none;
		padding-inline: 0;
	}

	:host([variant='inline']) .wrap:has(#input:focus) {
		box-shadow: none;
	}

	:host([variant='inline']) .hint,
	:host([variant='inline']) .error {
		display: none;
	}
	:host([variant='inline'][disabled]) label {
		color: var(--cz-color-text-disabled);
		opacity: 0.5;
		cursor: not-allowed;
	}
	:host([variant='inline']) label {
		position: absolute;
		top: 25%;
		left: 0;
		width: 100%;
		transform-origin: left;
		transition:
			transform 0.25s,
			width 0.25s;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		z-index: 1;
	}

	:host([variant='inline']:focus-within) label,
	:host([variant='inline'][has-value]) label {
		transform: translateY(-75%) scale(0.85);
	}

	:host([variant='inline']) {
		slot[name='suffix']::slotted(*),
		slot[name='prefix']::slotted(*) {
			transform: translateY(0);
		}
	}

	/* === Variant: cell === */

	:host([variant='cell']) .wrap {
		border: 0.5px solid var(--cz-color-bg-quaternary);
		border-radius: 0;
		box-shadow: none;
	}
	:host([variant='cell'][invalid]) .wrap {
		border-color: var(--cz-color-border-error);
	}
	:host([variant='cell'][invalid]) .wrap:has(#input:focus) {
		background: var(--cz-color-bg-error);
		border: 0.5px solid transparent;
	}
	:host([variant='cell']) .wrap:has(#input:focus) {
		background: var(--cz-color-bg-quaternary);
	}

	:host([variant='cell']) label {
		display: none;
	}

	/* === No spinner === */

	:host([no-spinner]) #input::-webkit-inner-spin-button {
		display: none;
	}
	:host([no-spinner]) #input {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	/* === Autosize === */

	:host([autosize]) {
		width: min-content;
	}
	:host([autosize]) #input {
		--_pad: calc(var(--cz-spacing) * 12);
		min-width: calc(2ch + var(--_pad));
		width: calc(var(--chars) + var(--_pad));
	}
	:host([autosize]) .control {
		max-width: 100%;
	}

	:host([autosize][type='number']) #input {
		--width: calc(var(--chars) + 0.25em);
	}
	:host([autosize][type='number']:not([no-spinner])) #input {
		width: calc(var(--width) + 15px + var(--_pad));
		min-width: calc(2ch + 0.25em + 15px + var(--_pad));
	}
	:host([autosize][type='number'][no-spinner]) #input {
		width: calc(var(--width) + var(--_pad));
		min-width: calc(2ch + 0.25em + var(--_pad));
	}
	slot[name='prefix']::slotted(*) {
		padding-inline-start: calc(var(--cz-spacing) * 2);
	}

	slot[name='suffix']::slotted(*) {
		padding-inline-end: calc(var(--cz-spacing) * 2);
	}
`,_e=e=>M(()=>{if(e==null)return;const t=new RegExp(e,"u");return o=>{!o.defaultPrevented&&o.data&&!t.test(o.data)&&o.preventDefault()}},[e]),Ee=S(class extends C{constructor(t,o,s,n){super(t,o);a(this,"values");Object.assign(o.host,s),this.values=n}update(t,o){this.hasChanged(o)&&(this.values=o,Object.assign(this.state.host,t))}hasChanged(t=[]){return t.some((o,s)=>this.values[s]!==o)}});S(class extends C{update(){return this.state.host}});const Ae=/([A-Z])/gu,Z=(e,t,o)=>{e[t]=o,e.dispatchEvent(new CustomEvent(t.replace(Ae,"-$1").toLowerCase()+"-changed",{detail:{value:o}}))},jt=e=>{const t=Q(void 0),o=P(c=>t.current=c,[]),s=e.shadowRoot,n=P(c=>e.dispatchEvent(new Event(c.type,{bubbles:c.bubbles})),[]),r=P(c=>Z(e,"value",c.target.value),[]),l=P(c=>Z(e,"focused",c.type==="focus"),[]),d=P(()=>{var u;const c=(u=t.current)==null?void 0:u.checkValidity();return e.toggleAttribute("invalid",!c),c},[]);return Ee({validate:d},[d]),A(()=>{const c=u=>{var i,m;const f=u.composedPath()[0];(i=f==null?void 0:f.closest)!=null&&i.call(f,"input, textarea")||(u.preventDefault(),(m=t.current)==null||m.focus())};return s.addEventListener("mousedown",c),()=>s.removeEventListener("mousedown",c)},[]),{onChange:n,onFocus:l,onInput:r,onRef:o}},ke=({placeholder:e})=>e||" ",Te=["type","variant","hint","error-message","compact","required","pattern","allowed-pattern","min","max","step","autosize","label","placeholder",...Ft],Ce=e=>{var g;const{type:t="text",pattern:o,allowedPattern:s,autocomplete:n,value:r,readonly:l,disabled:d,min:c,max:u,step:f,maxlength:i,required:m}=e,{onChange:y,onFocus:k,onInput:w,onRef:v}=jt(e),h=_e(s);return e.toggleAttribute("has-value",!!r),Vt(p`
			<input
				${rt(v)}
				style="--chars: ${((g=r==null?void 0:r.toString())==null?void 0:g.length)??0}ch"
				id="input"
				part="input"
				type=${t}
				pattern=${_(o)}
				autocomplete=${_(n)}
				placeholder=${ke({placeholder:e.placeholder})}
				?readonly=${l}
				aria-disabled=${d?"true":"false"}
				?disabled=${d}
				?required=${m}
				.value=${nt(r??"")}
				maxlength=${_(i)}
				@beforeinput=${h}
				@input=${w}
				@change=${y}
				@focus=${k}
				@blur=${k}
				min=${_(c)}
				max=${_(u)}
				step=${_(f)}
			/>
		`,e)};customElements.define("cosmoz-input",I(Ce,{observedAttributes:Te,styleSheets:[j(Ut)],shadowRootInit:{mode:"open",delegatesFocus:!0}}));const mt=e=>{e.style.height="",e.style.height=`${e.scrollHeight}px`},Se=(e,t=0)=>{if(t>0){const o=e.getAttribute("rows")??"",s=e.style.height;e.style.height="",e.setAttribute("rows",t),e.style.maxHeight=e.getBoundingClientRect().height+"px",e.style.height=s,e.setAttribute("rows",o)}},Pe=e=>{const{value:t,maxRows:o}=e,s=M(()=>()=>e.shadowRoot.querySelector("#input"),[]);A(()=>Se(s(),o),[o,s]),A(()=>mt(s()),[s,t]),A(()=>{const n=s(),r=new ResizeObserver(()=>requestAnimationFrame(()=>mt(n)));return r.observe(n),()=>r.unobserve(n)},[s])},Re=["rows","placeholder","label","hint","error-message","required",...Ft],Le=e=>{const{autocomplete:t,value:o,placeholder:s,readonly:n,disabled:r,rows:l,cols:d,maxlength:c}=e,{onChange:u,onFocus:f,onInput:i,onRef:m}=jt(e);return Pe(e),Vt(p`
			<textarea id="input" part="input"
				${rt(m)}
				autocomplete=${_(t)}
				placeholder=${s||" "}
				rows=${l??1} cols=${_(d)}
				?readonly=${n} ?aria-disabled=${r} ?disabled=${r}
				.value=${nt(o??"")} maxlength=${_(c)} @input=${i}
				@change=${u} @focus=${f} @blur=${f}>`,e)};customElements.define("cosmoz-textarea",I(Le,{observedAttributes:Re,styleSheets:[j(Ut)],shadowRootInit:{mode:"open",delegatesFocus:!0}}));const Me=e=>{const{label:t,value:o,disabled:s,error:n}=e,r=P(l=>e.dispatchEvent(new CustomEvent("change",{detail:l.target.checked})),[]);return p`<input
			id="toggle"
			class="toggle"
			part="toggle"
			type="checkbox"
			.checked=${nt(!!o)}
			?disabled=${s}
			@change=${r}
		/>
		${z(t,()=>p`<label for="toggle">${t}</label>`)}
		<slot name="suffix"></slot>
		${z(n,l=>p`<div class="failure">${l}</div>`)} `},Oe=O`
	.toggle {
		appearance: none;
		width: calc(var(--cz-spacing) * 9);
		height: calc(var(--cz-spacing) * 4.5);
		display: inline-block;
		position: relative;
		border-radius: var(--cz-radius-3xl);
		overflow: hidden;
		outline: none;
		border: none;
		cursor: pointer;
		background: var(--cz-color-bg-quaternary);
		transition: background-color ease 0.25s;
		margin: 0;
	}
	.toggle::before {
		content: '';
		display: block;
		position: absolute;
		z-index: 2;
		width: calc(var(--cz-spacing) * 3.5);
		height: calc(var(--cz-spacing) * 3.5);
		background: var(--cz-color-brand-25);
		left: calc(var(--cz-spacing) * 0.5);
		top: calc(var(--cz-spacing) * 0.5);
		border-radius: var(--cz-radius-full);
		transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.25s;
	}
	.toggle:checked {
		background: var(--cz-color-bg-brand-solid);
	}
	.toggle:checked::before {
		left: calc(var(--cz-spacing) * 5);
	}
	label {
		padding-left: calc(var(--cz-spacing) * 4);
		font-size: var(--cz-text-sm);
		line-height: var(--cz-text-sm-line-height);
		color: var(--cz-color-text-secondary);
		cursor: pointer;
		user-select: none;
	}

	.failure {
		font-size: var(--cz-text-sm);
		line-height: var(--cz-text-sm-line-height);
		color: var(--cz-color-text-secondary);
	}
	.toggle[disabled] {
		opacity: 0.6;
	}
`,Ie=O`
	:host {
		display: block;
	}

	:host > * {
		vertical-align: middle;
		line-height: 0px;
	}

	::slotted(*) {
		margin-left: calc(var(--cz-spacing) * 1);
	}
`;customElements.define("cosmoz-toggle",I(Me,{styleSheets:[Ie,Oe],observedAttributes:["label","disabled","error"]}));const Bt=["T"," "],vt=e=>{if(!e||typeof e!="string")return;let t;return Bt.some(o=>e.match(o)?(t=e.split(o),!0):!1),t||[e]},Ne=(e,t)=>{const o=vt(e),s=vt(t);return{minDate:Array.isArray(o)?o.shift():null,minTime:Array.isArray(o)?o.shift():null,maxDate:Array.isArray(s)?s.shift():null,maxTime:Array.isArray(s)?s.shift():null}},bt=(e,t)=>{if(!(!e&&!t))return!e&&t?`T${t}`:e&&!t?e:`${e}T${t}`},U=e=>{if(e){for(const t of Bt)if(e.match(t)){const o=e.split(t);return{date:o.shift(),time:o.shift()}}return{date:e}}},De=e=>{const{dateLabel:t,timeLabel:o,min:s,max:n,step:r="1",value:l}=e,{minDate:d,maxDate:c,minTime:u,maxTime:f}=M(()=>Ne(s,n),[s,n]),{date:i,time:m}=M(()=>U(l)??{},[l]);return A(()=>{e.dispatchEvent(new CustomEvent("cosmoz-datetime-input-value-changed",{bubbles:!0,composed:!0}))},[l]),p`
		<style>
			:host {
				display: flex;
				flex-direction: row;
				gap: var(--cz-spacing);
			}
		</style>
		<cosmoz-input
			label="${t}"
			type="date"
			.value="${i}"
			@value-changed="${y=>Z(e,"value",bt(y.target.value,m))}"
			.min="${d}"
			.max="${c}"
		></cosmoz-input>
		<cosmoz-input
			label="${o}"
			type="time"
			.value="${m}"
			@value-changed="${y=>Z(e,"value",bt(i,y.target.value))}"
			step="${r}"
			.min="${u}"
			.max="${f}"
		></cosmoz-input>
	`};customElements.define("cosmoz-datetime-input",I(De,{observedAttributes:["date-label","time-label","min","max","step"],styleSheets:[it]}));const je={title:"Datetime Input",component:"cosmoz-datetime-input"},Ht=be(e=>{const[t,o]=le("2019-10-02T12:33:59");return e({value:t,setValue:o})}),H={render:()=>p`${Ht(({value:e,setValue:t})=>{var o,s;return p`
                <cosmoz-datetime-input
                    date-label="Date label"
                    time-label="Time Label"
                    .value=${e}
                    @value-changed=${n=>t(n.target.value)}
                ></cosmoz-datetime-input>
                <div>
                    <p>Date: ${(o=U(e))==null?void 0:o.date}</p>
                    <p>Time: ${(s=U(e))==null?void 0:s.time}</p>
                    <p>Value: ${e}</p>
                </div>
            `})}`},q={render:()=>p`${Ht(({value:e,setValue:t})=>{var o,s;return p`
                <cosmoz-datetime-input
                    date-label="Date label"
                    time-label="Time Label"
                    min="2019-10-01T12:00:00"
                    max="2019-10-07T14:00:00"
                    .value=${e}
                    @value-changed=${n=>t(n.target.value)}
                ></cosmoz-datetime-input>
                <div>
                    <p>Date: ${(o=U(e))==null?void 0:o.date}</p>
                    <p>Time: ${(s=U(e))==null?void 0:s.time}</p>
                    <p>Min: 2019-10-01T12:00:00</p>
                    <p>Max: 2019-10-07T14:00:00</p>
                    <input
                        .value="${e}"
                        @input="${n=>t(n.target.value)}"
                    />
                </div>
            `})}`};var xt,$t,_t;H.parameters={...H.parameters,docs:{...(xt=H.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  render: () => html\`\${state(({
    value,
    setValue
  }: {
    value: string;
    setValue: (val: string) => void;
  }) => html\`
                <cosmoz-datetime-input
                    date-label="Date label"
                    time-label="Time Label"
                    .value=\${value}
                    @value-changed=\${(e: CustomEvent<{
    value: string;
  }>) => setValue(e.target.value)}
                ></cosmoz-datetime-input>
                <div>
                    <p>Date: \${fromValue(value)?.date}</p>
                    <p>Time: \${fromValue(value)?.time}</p>
                    <p>Value: \${value}</p>
                </div>
            \`)}\`
}`,...(_t=($t=H.parameters)==null?void 0:$t.docs)==null?void 0:_t.source}}};var Et,At,kt;q.parameters={...q.parameters,docs:{...(Et=q.parameters)==null?void 0:Et.docs,source:{originalSource:`{
  render: () => html\`\${state(({
    value,
    setValue
  }: {
    value: string;
    setValue: (val: string) => void;
  }) => html\`
                <cosmoz-datetime-input
                    date-label="Date label"
                    time-label="Time Label"
                    min="2019-10-01T12:00:00"
                    max="2019-10-07T14:00:00"
                    .value=\${value}
                    @value-changed=\${(e: CustomEvent<{
    value: string;
  }>) => setValue(e.target.value)}
                ></cosmoz-datetime-input>
                <div>
                    <p>Date: \${fromValue(value)?.date}</p>
                    <p>Time: \${fromValue(value)?.time}</p>
                    <p>Min: 2019-10-01T12:00:00</p>
                    <p>Max: 2019-10-07T14:00:00</p>
                    <input
                        .value="\${value}"
                        @input="\${(e: InputEvent) => setValue((e.target as HTMLInputElement).value)}"
                    />
                </div>
            \`)}\`
}`,...(kt=(At=q.parameters)==null?void 0:At.docs)==null?void 0:kt.source}}};const Be=["basic","minMax"];export{Be as __namedExportsOrder,H as basic,je as default,q as minMax};
