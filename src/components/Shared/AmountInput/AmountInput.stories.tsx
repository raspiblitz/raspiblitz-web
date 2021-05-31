import { Meta, Story } from '@storybook/react';
import AmountInput, { AmountInputProps } from './AmountInput';

export default {
  title: 'Shared/AmountInput',
  component: AmountInput
} as Meta;

const Template: Story<AmountInputProps> = (args) => <AmountInput {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  amount: 200,
  onChangeAmount: () => {}
};
