import {
	assert, html, fixture
} from '@open-wc/testing';
import '../cosmoz-datetime-input';

suite('basic', () => {
	let input;
	const eventType = 'cosmoz-datetime-input-value-changed';
	setup(async () => {
		input = await fixture(html`<cosmoz-datetime-input />`);
	});

	test('setting input value updates date and time', () => {
		input.value = '2019-10-14T14:33:59';
		assert.equal(input.date, '2019-10-14');
		assert.equal(input.time, '14:33:59');

		input.value = '2024-08-14T01:02:03';
		assert.equal(input.date, '2024-08-14');
		assert.equal(input.time, '01:02:03');

		input.value = '1997-11-03T11:37:48';
		assert.equal(input.date, '1997-11-03');
		assert.equal(input.time, '11:37:48');

		input.value = '2004-02-13T06:23:07';
		assert.equal(input.date, '2004-02-13');
		assert.equal(input.time, '06:23:07');
	});

	test('setting input value updates date', () => {
		input.value = '2016-04-24';
		assert.equal(input.date, '2016-04-24');
		assert.isUndefined(input.time);

		input.value = '2119-12-31';
		assert.equal(input.date, '2119-12-31');
		assert.isUndefined(input.time);

		input.value = '2000-07-13';
		assert.equal(input.date, '2000-07-13');
		assert.isUndefined(input.time);

		input.value = '2019-09-28';
		assert.equal(input.date, '2019-09-28');
		assert.isUndefined(input.time);
	});


	test('_getDateTimeParts returns date, time', () => {
		assert.isUndefined(input._getDateTimeParts());
		assert.isUndefined(input._getDateTimeParts(null));
		assert.isUndefined(input._getDateTimeParts(''));

		let result = input._getDateTimeParts('2017-03-23T11:22:33');
		assert.equal(result[0], '2017-03-23');
		assert.equal(result[1], '11:22:33');

		result = input._getDateTimeParts('2021-12-03T09:26:04');
		assert.equal(result[0], '2021-12-03');
		assert.equal(result[1], '09:26:04');

		result = input._getDateTimeParts('2017-01-16T09:19:38');
		assert.equal(result[0], '2017-01-16');
		assert.equal(result[1], '09:19:38');

		result = input._getDateTimeParts('2034-05-26T14:33:15');
		assert.equal(result[0], '2034-05-26');
		assert.equal(result[1], '14:33:15');
	});

	test('_setMinMax accepts undefined arguments', () => {
		assert.equal(input.min, null);
		assert.equal(input.max, null);
		input._setMinMax();
		assert.isUndefined(input.min);
		assert.isUndefined(input.max);
	});

	test('_setMinMax sets minDate and minTime properties', () => {
		input._setMinMax('2015-07-30T10:04:17');
		assert.equal(input._minDate, '2015-07-30');
		assert.equal(input._minTime, '10:04:17');
		assert.isNull(input._maxDate);
		assert.isNull(input._maxTime);
	});

	test('_setMinMax sets maxDate and maxTime properties', () => {
		input._setMinMax(null, '2017-01-03T02:42:38');
		assert.isNull(input._minDate);
		assert.isNull(input._minTime);
		assert.equal(input._maxDate, '2017-01-03');
		assert.equal(input._maxTime, '02:42:38');
	});

	test('_setMinMax sets minDate, minTime, maxDate and maxTime properties', () => {
		input._setMinMax('2014-12-09T12:07:14', '2021-04-19T10:52:46');
		assert.equal(input._minDate, '2014-12-09');
		assert.equal(input._minTime, '12:07:14');
		assert.equal(input._maxDate, '2021-04-19');
		assert.equal(input._maxTime, '10:52:46');
	});

	test('_valueChanged sets date property', () => {
		input._valueChanged('2012-07-14');
		assert.equal(input.date, '2012-07-14');

		input._valueChanged('2016-11-23');
		assert.equal(input.date, '2016-11-23');

		input._valueChanged('1904-01-17');
		assert.equal(input.date, '1904-01-17');

		input._valueChanged('2195-06-20');
		assert.equal(input.date, '2195-06-20');
	});

	test('_valueChanged fires ' + eventType, () => {
		input.addEventListener(eventType, event => assert.equal(event.type, eventType));
		input._valueChanged('2012-07-14');
	});

	test('_valueChanged sets date and time property', () => {
		input._valueChanged('2020-01-09T04:52:15');
		assert.equal(input.date, '2020-01-09');
		assert.equal(input.time, '04:52:15');

		input._valueChanged('2012-10-15T07:28:13');
		assert.equal(input.date, '2012-10-15');
		assert.equal(input.time, '07:28:13');

		input._valueChanged('1936-12-03T18:36:01');
		assert.equal(input.date, '1936-12-03');
		assert.equal(input.time, '18:36:01');

		input._valueChanged('2048-09-16T02:22:41');
		assert.equal(input.date, '2048-09-16');
		assert.equal(input.time, '02:22:41');

		input._valueChanged(null);
		assert.equal(input.date, '');
		assert.equal(input.time, '');
	});

	test('_setValue sets value property', () => {
		input._setValue(null, null);
		assert.equal(input.value, null);

		input._setValue(null, '02:22:41');
		assert.equal(input.value, 'T02:22:41');

		input._setValue(null, null);
		input._setValue('2012-10-15', null);
		assert.equal(input.value, '2012-10-15');

		input._setValue(null, null);
		input._setValue('2012-10-15', '02:22:41');
		assert.equal(input.value, '2012-10-15T02:22:41');
	});
});

