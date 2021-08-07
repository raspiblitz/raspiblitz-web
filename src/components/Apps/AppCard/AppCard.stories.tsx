import { Meta, Story } from '@storybook/react';
import AppCard, { AppCardProps } from './AppCard';

export default {
  title: 'AppsComponents/AppCard',
  component: AppCard
} as Meta;

const Template: Story<AppCardProps> = (args) => <AppCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  app: {
    id: 'rtl',
    name: 'Ride the Lightning',
    description: 'Ride The Lightning - A full function web browser app for LND, C-Lightning and Eclair',
    installed: false
  },
  onInstall: () => {}
};
