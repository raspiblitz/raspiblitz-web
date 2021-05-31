import { Meta, Story } from '@storybook/react';
import TransactionCard, { TransactionCardProps } from './TransactionCard';

export default {
  title: 'HomeComponents/TransactionCard',
  component: TransactionCard
} as Meta;

const Template: Story<TransactionCardProps> = (args) => <TransactionCard {...args} />;

export const NoTransactions = Template.bind({});
NoTransactions.args = {
  transactions: [],
  showDetails: () => {}
};

export const WithTransactions = Template.bind({});
WithTransactions.args = {
  transactions: [
    {
      id: '7163dd4888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      type: 'onchain',
      amount: -1.00232,
      time: 1610329986,
      comment: 'last Lightning 123455555555555'
    },
    {
      id: 'blablabla',
      category: 'receive',
      type: 'lightning',
      amount: 1.3232,
      time: 1615746387,
      comment: ''
    },
    {
      id: '1234',
      category: 'send',
      amount: -4.001234,
      type: 'lightning',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '123456888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'lightning',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '0987651',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '7163BLABLABLAd07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: 'BLUBB275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: 'HI8b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '7163dd4888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '7163dd4888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '7163dd4888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '7163dd4888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '7163dd4888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '7163dd4888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1620222506,
      comment: 'LNsend 2'
    },
    {
      id: '7163dd4888b617e7275d07c0094dd7c3e8caab6cae2e087be8d81929b083fcfa',
      category: 'send',
      amount: -4.001234,
      type: 'onchain',
      time: 1622358195,
      comment: 'FIRST'
    }
  ],
  showDetails: () => {}
};
