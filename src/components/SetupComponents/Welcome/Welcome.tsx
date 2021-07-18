import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SetupContainer from '../../../container/SetupContainer/SetupContainer';
import I18nDropdown from '../../SettingsComponents/I18nDropdown/I18nDropdown';

const Welcome: FC = () => {
  const { t } = useTranslation();

  return (
    <SetupContainer>
        <span>{t('setup.welcome')}</span>
        <span>{t('setup.setlanguage')}</span>
        <I18nDropdown />
        <button className='bd-button p-2 my-5'>{t('setup.continue')}</button>
    </SetupContainer>
  );
};

export default Welcome;
