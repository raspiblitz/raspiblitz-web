import '../src/index.css';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../src/i18n/config';

export const globalTypes = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'de', right: '🇩🇪', title: 'German' }
      ],
      showName: true
    }
  }
};

export const parameters = {
  themes: {
    clearable: false,
    list: [
      {
        name: 'Light',
        class: [],
        color: '#ffffff',
        default: true
      },
      {
        name: 'Dark',
        // The class dark will be added to the body tag
        class: ['dark'],
        color: '#000000'
      }
    ]
  }
};

export const decorators = [
  (Story, { globals }) => {
    i18n.changeLanguage(globals.locale);
    return (
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    );
  }
];
