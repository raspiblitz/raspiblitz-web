import { Meta, Story } from '@storybook/react';
import LightningCard from './LightningCard';

export default {
  title: 'HomeComponents/LightningCard',
  component: LightningCard
} as Meta;

const Template: Story = (args) => <LightningCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
