import { Meta, Story } from '@storybook/react';
import AppInstallCard, { AppInstallCardProps } from './AppInstallCard';

export default {
  title: 'AppsComponents/AppInstallCard',
  component: AppInstallCard
} as Meta;

const Template: Story<AppInstallCardProps> = (args) => <AppInstallCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  id: 'rtl',
  name: 'Ride the Lightning',
  description: 'Ride The Lightning - A full function web browser app for LND, C-Lightning and Eclair',
  installed: false,
  onInstall: () => {}
};
