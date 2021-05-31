import { Meta, Story } from '@storybook/react';
import SendModal, { SendModalProps } from './SendModal';

export default {
  title: 'Shared/SendModal',
  component: SendModal
} as Meta;

const Template: Story<SendModalProps> = (args) => <SendModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onClose: () => {},
  lnBalance: 0.23232,
  onchainBalance: 1
};
