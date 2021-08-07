import { Meta, Story } from '@storybook/react';
import ChangePwModal, { ChangePwModalProps } from './ChangePwModal';

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.append(modalRoot);

export default {
  title: 'SettingsComponents/ChangePwModal',
  component: ChangePwModal
} as Meta;

const Template: Story<ChangePwModalProps> = (args) => <ChangePwModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onClose: () => {}
};
