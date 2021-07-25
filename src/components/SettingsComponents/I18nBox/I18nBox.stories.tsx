import { Meta, Story } from '@storybook/react';
import I18nBox from './I18nBox';

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.append(modalRoot);

export default {
  title: 'SettingsComponents/I18nBox',
  component: I18nBox
} as Meta;

const Template: Story = (args) => <I18nBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
