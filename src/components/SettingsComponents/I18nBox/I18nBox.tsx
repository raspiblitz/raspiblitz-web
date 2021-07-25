import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import I18nDropdown from '../../Shared/I18nDropdown/I18nDropdown';

const I18nBox: FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className='w-full lg:w-1/3 dark:text-white transition-colors box-border pt-5 px-5'>
      <div className='bg-white dark:bg-gray-800 p-5 rounded shadow-xl flex flex-col'>
        <div className='w-full justify-center flex my-2'>
          {t('settings.curr_lang')}:&nbsp;<strong>{i18n.language}</strong>
        </div>
        <div className='flex justify-between'>
          <I18nDropdown />
        </div>
      </div>
    </div>
  );
};

export default I18nBox;
