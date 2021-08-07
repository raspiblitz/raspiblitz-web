import { Meta, Story } from '@storybook/react';
import LightningCard, { LightningCardProps } from './LightningCard';

export default {
  title: 'HomeComponents/LightningCard',
  component: LightningCard
} as Meta;

const Template: Story<LightningCardProps> = (args) => <LightningCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  version: 'LND 0.12.0-beta',
  channelBalance: 1.0,
  channelOnline: 10,
  channelTotal: 11,
  status: 'online'
};
