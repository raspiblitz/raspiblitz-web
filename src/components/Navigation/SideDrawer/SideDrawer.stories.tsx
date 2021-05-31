import { Meta, Story } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import SideDrawer from './SideDrawer';

export default {
  title: 'Navigation/SideDrawer',
  component: SideDrawer
} as Meta;

const Template: Story = (args) => (
  <BrowserRouter>
    <SideDrawer {...args} />
  </BrowserRouter>
);

export const Primary = Template.bind({});
Primary.args = {};
