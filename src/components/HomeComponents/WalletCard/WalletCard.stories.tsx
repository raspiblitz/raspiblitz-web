import { Meta, Story } from '@storybook/react';
import WalletCard, { WalletCardProps } from './WalletCard';

export default {
  title: 'HomeComponents/WalletCard',
  component: WalletCard
} as Meta;

const Template: Story<WalletCardProps> = (args) => <WalletCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onchainBalance: 1.00000001,
  lnBalance: 1.00000001,
  onReceive: () => {},
  onSend: () => {}
};
