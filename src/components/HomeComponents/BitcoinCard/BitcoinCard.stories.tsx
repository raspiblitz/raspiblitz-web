import { Meta, Story } from '@storybook/react';
import BitcoinCard from './BitcoinCard';

export default {
  title: 'HomeComponents/BitcoinCard',
  component: BitcoinCard
} as Meta;

const Template: Story = (args) => <BitcoinCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
