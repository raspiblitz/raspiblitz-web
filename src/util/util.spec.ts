import { retrieveSettings, saveSettings, SETTINGS_KEY } from './util';

describe('util', () => {
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    window.localStorage.__proto__.setItem = jest.fn();

    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => null);
  });

  test('saveSettings should save settings', () => {
    saveSettings({ darkMode: false, lang: 'de' });

    expect(localStorage.setItem).toHaveBeenCalledWith(SETTINGS_KEY, JSON.stringify({ darkMode: false, lang: 'de' }));
  });

  test('saveSettings should save partial settings', () => {
    window.localStorage.__proto__.getItem = jest.fn(() => JSON.stringify({ darkMode: true, lang: 'en' }));

    saveSettings({ lang: 'de' });

    expect(localStorage.setItem).toHaveBeenCalledWith(SETTINGS_KEY, JSON.stringify({ darkMode: true, lang: 'de' }));
  });

  test('retrieveSettings should retrieve settings if available', () => {
    window.localStorage.__proto__.getItem = jest.fn(() => JSON.stringify({ darkMode: true, lang: 'en' }));

    const settings = retrieveSettings();

    expect(settings?.darkMode).toBeTruthy();
    expect(settings?.lang).toBe('en');
  });

  test('retrieveSettings should return null if not available', () => {
    const settings = retrieveSettings();

    expect(settings).toBeNull();
  });
});
