import { Meta, Story } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import BottomNav from './BottomNav';

export default {
  title: 'Navigation/BottomNav',
  component: BottomNav
} as Meta;

const Template: Story = (args) => (
  <BrowserRouter>
    <BottomNav {...args} />
  </BrowserRouter>
);

export const Primary = Template.bind({});
Primary.args = {};
