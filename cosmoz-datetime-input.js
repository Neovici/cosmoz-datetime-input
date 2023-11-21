import { html, component, useEffect, useMemo } from 'haunted';
import { notifyProperty } from '@neovici/cosmoz-utils/hooks/use-notify-property';
import '@neovici/cosmoz-input';

/**
 * The possible separators between date and time input values
 */
const separators = ['T', ' '];

/**
 * Returns a [date, time] or [date] array via a dateTime string.
 * @param {String} aDateTime - The datetime or date string.
 * @return {undefined}
 */
const getDateTimeParts = (aDateTime) => {
	if (!aDateTime) {
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

/**
 * Gets the min/max-date/time properties via min/max-dateTime strings.
 * @param {String} min - The min Date/DateTime.
 * @param {String} max - the max Date/DateTime.
 * @return {undefined}
 */
const getMinMax = (min, max) => {
	const minParts = getDateTimeParts(min),
		maxParts = getDateTimeParts(max);

	return {
		minDate: Array.isArray(minParts) ? minParts.shift() : null,
		minTime: Array.isArray(minParts) ? minParts.shift() : null,
		maxDate: Array.isArray(maxParts) ? maxParts.shift() : null,
		maxTime: Array.isArray(maxParts) ? maxParts.shift() : null,
	};
};

export const toValue = (date, time) => {
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

export const fromValue = (value) => {
	if (!value) {
		return;
	}

	for (const split of separators) {
		if (value.match(split)) {
			const parts = value.split(split);
			return {
				date: parts.shift(),
				time: parts.shift(),
			};
		}
	}
	return { date: value };
};

/**
 * `cosmoz-datetime-input`
 *
 * Mimics `<input type="cosmoz-datetime-input">`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

const DateTimeInput = (host) => {
	const { dateLabel, timeLabel, min, max, step = '1', value } = host;
	const { minDate, maxDate, minTime, maxTime } = useMemo(
		() => getMinMax(min, max),
		[min, max],
	);
	const { date, time } = useMemo(() => fromValue(value) ?? {}, [value]);
	useEffect(() => {
		host.dispatchEvent(
			new CustomEvent('cosmoz-datetime-input-value-changed', {
				bubbles: true,
				composed: true,
			}),
		);
	}, [value]);

	return html`
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
			@value-changed="${(e) =>
				notifyProperty(host, 'value', toValue(e.target.value, time))}"
			.min="${minDate}"
			.max="${maxDate}"
		></cosmoz-input>
		<cosmoz-input
			label="${timeLabel}"
			type="time"
			.value="${time}"
			@value-changed="${(e) =>
				notifyProperty(host, 'value', toValue(date, e.target.value))}"
			step="${step}"
			.min="${minTime}"
			.max="${maxTime}"
		></cosmoz-input>
	`;
};
customElements.define(
	'cosmoz-datetime-input',
	component(DateTimeInput, {
		observedAttributes: ['date-label', 'time-label', 'min', 'max', 'step'],
	}),
);
