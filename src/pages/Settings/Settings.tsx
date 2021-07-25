import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePwModal from '../../components/SettingsComponents/ChangePwModal/ChangePwModal';
import I18nBox from '../../components/SettingsComponents/I18nBox/I18nBox';
import ConfirmModal from '../../components/Shared/ConfirmModal/ConfirmModal';
import ActionBox from '../../container/ActionBox/ActionBox';

const Settings: FC = () => {
  const { t } = useTranslation();
  const [confirmShutdown, setConfirmShutdown] = useState(false);
  const [confirmReboot, setConfirmReboot] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);

  const showShutdownModalHandler = () => {
    setConfirmShutdown(true);
  };

  const hideShutdownModalHandler = () => {
    setConfirmShutdown(false);
  };

  const showRebootModalHandler = () => {
    setConfirmReboot(true);
  };

  const hideRebootModalHandler = () => {
    setConfirmReboot(false);
  };

  const showPwModalHandler = () => {
    setShowPwModal(true);
  };

  const hidePwModalHandler = () => {
    setShowPwModal(false);
  };

  return (
    <div className='content-container page-container flex flex-col dark:text-white'>
      <I18nBox />
      <ActionBox name={t('settings.change_pw')} actionName={t('settings.change')} action={showPwModalHandler} />
      <ActionBox name={t('settings.reboot')} actionName={t('settings.reboot')} action={showRebootModalHandler} />
      <ActionBox name={t('settings.shutdown')} actionName={t('settings.shutdown')} action={showShutdownModalHandler} />
      {showPwModal && <ChangePwModal onClose={hidePwModalHandler} />}
      {confirmReboot && (
        <ConfirmModal
          confirmText={t('settings.reboot') + '?'}
          onClose={hideRebootModalHandler}
          confirmEndpoint='/system/reboot'
        />
      )}
      {confirmShutdown && (
        <ConfirmModal
          confirmText={t('settings.shutdown') + '?'}
          onClose={hideShutdownModalHandler}
          confirmEndpoint='/system/shutdown'
        />
      )}
    </div>
  );
};

export default Settings;
