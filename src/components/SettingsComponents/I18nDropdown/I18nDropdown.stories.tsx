import { Meta, Story } from '@storybook/react';
import I18nDropdown from './I18nDropdown';

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.append(modalRoot);

export default {
  title: 'SettingsComponents/I18nDropdown',
  component: I18nDropdown
} as Meta;

const Template: Story = (args) => <I18nDropdown {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
