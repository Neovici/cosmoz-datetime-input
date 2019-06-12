import '@webcomponents/shadycss/entrypoints/apply-shim';

import '@polymer/paper-input/paper-input-container';

import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';

/**
 * `cosmoz-datetime-input`
 *
 * Mimics `<input type="cosmoz-datetime-input">`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class CosmozDatetimeInput extends PolymerElement {
	static get template() {
		return html`
			<style>
			:host {
				display: block;
			}
			.container {
				display: -ms-flexbox;
				display: -webkit-flex;
				display: flex;
				-ms-flex-direction: row;
				-webkit-flex-direction: row;
				flex-direction: row;
				@apply --cosmoz-datetime-input-container;
			}
			input {
				@apply --cosmoz-datetime-input-input;
			}
			label {
				pointer-events: none;
				@apply --cosmoz-datetime-input-label;
			}
		</style>

		<div class="container">
			<paper-input-container always-float-label="">
				<label hidden\$="[[ !dateLabel ]]" slot="label" aria-hidden="true" for="dateInput">[[ dateLabel ]]</label>
				<input id="dateInput" type="date" slot="input" value="{{ date::input }}" min\$="[[ _minDate ]]" max\$="[[ _maxDate ]]">
			</paper-input-container>
			<paper-input-container always-float-label="">
				<label hidden\$="[[ !timeLabel ]]" slot="label" aria-hidden="true" for="timeInput">[[ timeLabel ]]</label>
				<input id="timeInput" type="time" slot="input" value="{{ time::input }}" step="[[ step ]]" min\$="[[ _minTime ]]" max\$="[[ _maxTime ]]">
			</paper-input-container>
		</div>
`;
	}

	static get is() {
		return 'cosmoz-datetime-input';
	}
	/* eslint-disable-next-line max-lines-per-function */
	static get properties() {
		return {
			/**
			 * The date part of the value
			 */
			date: {
				type: String,
				notify: true
			},
			/**
			 * The date part of the value
			 */
			time: {
				type: String,
				notify: true
			},
			/**
			 * The step of the time input
			 */
			step: {
				type: String,
				value: '1'
			},
			/**
			 * The date or datetime input value
			 */
			value: {
				type: String,
				notify: true,
				observer: '_valueChanged'
			},
			/**
			 * The label of the time input
			 */
			timeLabel: {
				type: String
			},
			/**
			 * The label of the date input
			 */
			dateLabel: {
				type: String
			},
			/**
			 * The max date/datetime of the inputs
			 */
			max: {
				type: String
			},
			/**
			 * The min date/datetime of the inputs
			 */
			min: {
				type: String
			},
			_minDate: {
				type: String
			},
			_maxDate: {
				type: String
			},
			_minTime: {
				type: String
			},
			_maxTime: {
				type: String
			},
			/**
			 * The possible separators between date and time input values
			 */
			_separators: {
				type: Array,
				value() {
					return ['T', ' '];
				}
			}
		};
	}
	static get observers() {
		return [
			'_setValue(date, time)',
			'_setMinMax(min, max)'
		];
	}
	constructor() {
		super();
	}

	/**
	 * Sets the value property via a date and time string.
	 * @param {String} date - The date string.
	 * @param {String} time - The time string.
	 * @return {undefined}
	 */
	_setValue(date, time) {
		if (!date && !time) {
			this.value = null;
			return;
		}

		if (!date && time) {
			this.value = `T${time}`;
			return;
		}

		if (date && !time) {
			this.value = date;
			return;
		}
		this.value = `${date}T${time}`;
	}

	/**
	 * Sets the date and time property via a value string.
	 * @param {String} value - The input value. Either datetime or date string.
	 * @return {undefined}
	 */
	_valueChanged(value) {
		if (!value) {
			this.date = '';
			this.time = '';
			return;
		}
		const isDatetime = this._separators.some(split => {
			if (!value.match(split)) {
				return false;
			}
			const parts = this._getDateTimeParts(value);
			this.date = parts.shift();
			this.time = parts.shift();
			return true;
		});

		if (!isDatetime) {
			this.date = value;
		}
		this.dispatchEvent(new CustomEvent('cosmoz-datetime-input-value-changed', { bubbles: true, composed: true }));
	}

	/**
	 * Returns a [date, time] or [date] array via a dateTime string.
	 * @param {String} aDateTime - The datetime or date string.
	 * @return {undefined}
	 */
	_getDateTimeParts(aDateTime) {
		if (!aDateTime) {
			return;
		}

		let parts;

		this._separators.some(split => {
			if (!aDateTime.match(split)) {
				return false;
			}
			parts = aDateTime.split(split);
			return true;
		});

		return parts || [aDateTime];
	}
	/**
	 * Sets the min/max-date/time properties via min/max-dateTime strings.
	 * @param {String} min - The min Date/DateTime.
	 * @param {String} max - the max Date/DateTime.
	 * @return {undefined}
	 */
	_setMinMax(min, max) {
		const minParts = this._getDateTimeParts(min),
			maxParts = this._getDateTimeParts(max);

		this._minDate = Array.isArray(minParts) ? minParts.shift() : null;
		this._minTime = Array.isArray(minParts) ? minParts.shift() : null;

		this._maxDate = Array.isArray(maxParts) ? maxParts.shift() : null;
		this._maxTime = Array.isArray(maxParts) ? maxParts.shift() : null;
	}
}
customElements.define(CosmozDatetimeInput.is, CosmozDatetimeInput);
