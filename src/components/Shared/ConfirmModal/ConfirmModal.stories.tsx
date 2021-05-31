import { Meta, Story } from '@storybook/react';
import ConfirmModal, { ConfirmModalProps } from './ConfirmModal';

export default {
  title: 'Shared/ConfirmModal',
  component: ConfirmModal
} as Meta;

const Template: Story<ConfirmModalProps> = (args) => <ConfirmModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  confirmEndpoint: '',
  confirmText: 'ConfirmText',
  onClose: () => {}
};
