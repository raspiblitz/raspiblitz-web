import { Meta, Story } from '@storybook/react';
import WalletCard, { WalletCardProps } from './WalletCard';

export default {
  title: 'HomeComponents/WalletCard',
  component: WalletCard
} as Meta;

const Template: Story<WalletCardProps> = (args) => <WalletCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onReceive: () => {},
  onSend: () => {}
};
