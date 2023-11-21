import { assert, html, fixture, nextFrame, oneEvent } from '@open-wc/testing';
import '../cosmoz-datetime-input';

const getDate = (el) => el.shadowRoot.querySelector('[type="date"]')?.value;
const getTime = (el) => el.shadowRoot.querySelector('[type="time"]')?.value;

/* eslint-disable-next-line max-lines-per-function */
suite('basic', () => {
	const eventType = 'cosmoz-datetime-input-value-changed';

	test('setting input value updates date and time', async () => {
		const input = await fixture(html`<cosmoz-datetime-input />`);

		input.value = '2019-10-14T14:33:59';
		await nextFrame();
		assert.equal(getDate(input), '2019-10-14');
		assert.equal(getTime(input), '14:33:59');

		input.value = '2024-08-14T01:02:03';
		await nextFrame();
		assert.equal(getDate(input), '2024-08-14');
		assert.equal(getTime(input), '01:02:03');

		input.value = '1997-11-03T11:37:48';
		await nextFrame();
		assert.equal(getDate(input), '1997-11-03');
		assert.equal(getTime(input), '11:37:48');

		input.value = '2004-02-13T06:23:07';
		await nextFrame();
		assert.equal(getDate(input), '2004-02-13');
		assert.equal(getTime(input), '06:23:07');
	});

	test('setting input value updates date', async () => {
		const input = await fixture(html`<cosmoz-datetime-input />`);
		input.value = '2016-04-24';
		await nextFrame();
		assert.equal(getDate(input), '2016-04-24');
		assert.isUndefined(getTime(input));

		input.value = '2119-12-31';
		await nextFrame();
		assert.equal(getDate(input), '2119-12-31');
		assert.isUndefined(getTime(input));

		input.value = '2000-07-13';
		await nextFrame();
		assert.equal(getDate(input), '2000-07-13');
		assert.isUndefined(getTime(input));

		input.value = '2019-09-28';
		await nextFrame();
		assert.equal(getDate(input), '2019-09-28');
		assert.isUndefined(getTime(input));
	});

	test('change value', async () => {
		const input = await fixture(
			html`<cosmoz-datetime-input
				min="2019-10-01T12:00:00"
				max="2019-10-07T14:00:00"
				.value=${'2019-10-02T12:33:59'}
			/>`,
		);

		await nextFrame();
		assert.equal(
			input.shadowRoot.querySelector('[type="date"]')?.min,
			'2019-10-01',
		);
		assert.equal(
			input.shadowRoot.querySelector('[type="time"]')?.max,
			'14:00:00',
		);
		setTimeout(() => {
			const date = input.shadowRoot
				.querySelector('[type="date"]')
				.shadowRoot.querySelector('input');
			date.value = '2019-10-05';
			date.dispatchEvent(new KeyboardEvent('input'));
		});
		const ev = await oneEvent(input, 'value-changed');
		assert.equal(ev.target.value, '2019-10-05T12:33:59');
	});
});
