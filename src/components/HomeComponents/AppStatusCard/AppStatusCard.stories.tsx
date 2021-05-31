import { Meta, Story } from '@storybook/react';
import RTL from '../../assets/apps/rtl.png';
import AppStatusCard, { AppStatusCardProps } from './AppStatusCard';

export default {
  title: 'HomeComponents/AppStatusCard',
  component: AppStatusCard
} as Meta;

const Template: Story<AppStatusCardProps> = (args) => <AppStatusCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  icon: RTL,
  status: 'online',
  name: 'Ride the Lightning',
  description: 'Ride The Lightning - A full function web browser app for LND, C-Lightning and Eclair'
};
