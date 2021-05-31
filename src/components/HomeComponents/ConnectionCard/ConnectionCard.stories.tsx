import { Meta, Story } from '@storybook/react';
import ConnectionCard from './ConnectionCard';

export default {
  title: 'HomeComponents/ConnectionCard',
  component: ConnectionCard
} as Meta;

const Template: Story = (args) => <ConnectionCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
