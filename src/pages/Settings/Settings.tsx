import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangePwModal from '../../components/SettingsComponents/ChangePwModal/ChangePwModal';
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
    <div className='mobile-container md:content-container overflow-y-auto flex flex-col w-full dark:text-white'>
      <ActionBox name={t('settings.change_pw')} actionName={t('settings.change')} action={showPwModalHandler} />
      <ActionBox name={t('settings.reboot')} actionName={t('settings.reboot')} action={showRebootModalHandler} />
      <ActionBox name={t('settings.shutdown')} actionName={t('settings.shutdown')} action={showShutdownModalHandler} />
      {showPwModal && <ChangePwModal onClose={hidePwModalHandler} />}
      {confirmReboot && (
        <ConfirmModal
          confirmText={t('settings.reboot') + '?'}
          onClose={hideRebootModalHandler}
          confirmEndpoint='reboot'
        />
      )}
      {confirmShutdown && (
        <ConfirmModal
          confirmText={t('settings.shutdown') + '?'}
          onClose={hideShutdownModalHandler}
          confirmEndpoint='shutdown'
        />
      )}
    </div>
  );
};

export default Settings;
