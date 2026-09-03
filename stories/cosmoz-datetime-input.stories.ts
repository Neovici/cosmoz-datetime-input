import { html, useState, virtual } from '@pionjs/pion';
import type { StoryObj } from '@storybook/web-components-vite';

import { fromValue } from '../src/cosmoz-datetime-input';

type Story = StoryObj;

export default {
	title: 'Datetime Input',
	component: 'cosmoz-datetime-input',
};

const state = virtual(
	(
		render: (state: {
			value: string;
			setValue: (val: string) => void;
		}) => ReturnType<typeof html>,
	) => {
		const [value, setValue] = useState('2019-10-02T12:33:59');
		return render({
			value,
			setValue,
		});
	},
);

export const basic: Story = {
	render: () =>
		html`${state(
			({
				value,
				setValue,
			}: {
				value: string;
				setValue: (val: string) => void;
			}) => html`
				<cosmoz-datetime-input
					date-label="Date label"
					time-label="Time Label"
					.value=${value}
					@value-changed=${(e: CustomEvent<{ value: string }>) =>
						setValue(e.target.value)}
				></cosmoz-datetime-input>
				<div>
					<p>Date: ${fromValue(value)?.date}</p>
					<p>Time: ${fromValue(value)?.time}</p>
					<p>Value: ${value}</p>
				</div>
			`,
		)}`,
};

export const minMax: Story = {
	render: () =>
		html`${state(
			({
				value,
				setValue,
			}: {
				value: string;
				setValue: (val: string) => void;
			}) => html`
				<cosmoz-datetime-input
					date-label="Date label"
					time-label="Time Label"
					min="2019-10-01T12:00:00"
					max="2019-10-07T14:00:00"
					.value=${value}
					@value-changed=${(e: CustomEvent<{ value: string }>) =>
						setValue(e.target.value)}
				></cosmoz-datetime-input>
				<div>
					<p>Date: ${fromValue(value)?.date}</p>
					<p>Time: ${fromValue(value)?.time}</p>
					<p>Min: 2019-10-01T12:00:00</p>
					<p>Max: 2019-10-07T14:00:00</p>
					<input
						.value="${value}"
						@input="${(e: InputEvent) =>
							setValue((e.target as HTMLInputElement).value)}"
					/>
				</div>
			`,
		)}`,
};
