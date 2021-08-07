import { Meta, Story } from '@storybook/react';
import ConnectionCard, { ConnectionCardProps } from './ConnectionCard';

export default {
  title: 'HomeComponents/ConnectionCard',
  component: ConnectionCard
} as Meta;

const Template: Story<ConnectionCardProps> = (args) => <ConnectionCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  sshAddress: 'ssh@127.0.0.1',
  torAddress: 'blablablabla.onion'
};
