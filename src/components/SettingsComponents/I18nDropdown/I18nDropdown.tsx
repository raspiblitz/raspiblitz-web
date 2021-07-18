import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resources } from '../../../i18n/config';

const I18nDropdown: FC = () => {
  const { t, i18n } = useTranslation();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [saveLang, setSaveLang] = useState(false);

  const langs = Object.keys(resources);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = i18n.language;
    }
  }, [i18n]);

  const dropdownHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value !== i18n.language) {
      setSaveLang(true);
    } else {
      setSaveLang(false);
    }
  };

  const saveLangHandler = () => {
    i18n.changeLanguage(selectRef.current?.value);
    setSaveLang(false);
  };

  return (
    <div className='w-full lg:w-1/3 dark:text-white transition-colors box-border pt-5 px-5'>
      <div className='relative bg-white dark:bg-gray-800 p-5 rounded shadow-xl flex flex-col'>
        <div className='w-full justify-center flex my-2'>
          {t('settings.curr_lang')}:&nbsp;<strong>{i18n.language}</strong>
        </div>
        <div className='flex justify-between'>
          <label htmlFor='lngSelect' className='font-bold flex items-center'>
            {t('settings.language')}
          </label>
          <select id='lngSelect' ref={selectRef} onChange={dropdownHandler} className='border w-1/3 dark:text-black'>
            {langs.map((lang, i) => {
              return (
                <option key={i} value={lang}>
                  {lang}
                </option>
              );
            })}
          </select>
          <button
            onClick={saveLangHandler}
            disabled={!saveLang}
            className='w-1/3 bd-button'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default I18nDropdown;
