import { Meta, Story } from '@storybook/react';
import AppStatusCard, { AppStatusCardProps } from './AppStatusCard';

export default {
  title: 'HomeComponents/AppStatusCard',
  component: AppStatusCard
} as Meta;

const Template: Story<AppStatusCardProps> = (args) => <AppStatusCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  id: 'rtl',
  status: 'online',
  name: 'Ride the Lightning'
};
