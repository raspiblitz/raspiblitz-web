import { Meta, Story } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

export default {
  title: 'Navigation/Header',
  component: Header
} as Meta;

const Template: Story = (args) => (
  <BrowserRouter>
    <Header {...args} />
  </BrowserRouter>
);

export const Primary = Template.bind({});
Primary.args = {};
