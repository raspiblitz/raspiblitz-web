import { Meta, Story } from '@storybook/react';
import BitcoinCard, { BitcoinCardProps } from './BitcoinCard';

export default {
  title: 'HomeComponents/BitcoinCard',
  component: BitcoinCard
} as Meta;

const Template: Story<BitcoinCardProps> = (args) => <BitcoinCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  version: 'bitcoind 0.21.1',
  status: 'Syncing',
  network: 'mainnet',
  currBlock: 12345,
  maxBlock: 12346
};
