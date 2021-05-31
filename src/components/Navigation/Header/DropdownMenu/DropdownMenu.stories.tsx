import { Meta, Story } from '@storybook/react';
import DropdownMenu from './DropdownMenu';

export default {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu
} as Meta;

const Template: Story = (args) => <DropdownMenu {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
