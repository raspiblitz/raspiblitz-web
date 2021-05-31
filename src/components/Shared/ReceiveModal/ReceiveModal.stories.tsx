import { Meta, Story } from '@storybook/react';
import ReceiveModal, { ReceiveModalProps } from './ReceiveModal';

export default {
  title: 'Shared/ReceiveModal',
  component: ReceiveModal
} as Meta;

const Template: Story<ReceiveModalProps> = (args) => <ReceiveModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onClose: () => {}
};
