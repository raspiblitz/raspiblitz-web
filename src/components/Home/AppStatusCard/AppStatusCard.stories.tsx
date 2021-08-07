import { Meta, Story } from '@storybook/react';
import { AppStatus } from '../../../models/app-status.model';
import AppStatusCard from './AppStatusCard';

export default {
  title: 'HomeComponents/AppStatusCard',
  component: AppStatusCard
} as Meta;

const Template: Story<{ app: AppStatus }> = (args) => <AppStatusCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  app: {
    id: 'rtl',
    status: 'online',
    name: 'Ride the Lightning'
  }
};
