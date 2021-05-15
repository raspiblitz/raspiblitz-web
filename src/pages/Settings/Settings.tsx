import { FC, useState } from 'react';
import ChangePwModal from '../../components/ChangePwModal/ChangePwModal';
import ConfirmModal from '../../components/Shared/ConfirmModal/ConfirmModal';
import ActionBox from '../../container/ActionBox/ActionBox';

const Settings: FC = () => {
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
    <div className='content-container flex flex-col w-full dark:text-white'>
      <ActionBox name='Change Password' actionName='Change' action={showPwModalHandler} />
      <ActionBox name='Reboot' actionName='Reboot' action={showRebootModalHandler} />
      <ActionBox name='Shutdown' actionName='Shutdown' action={showShutdownModalHandler} />
      {showPwModal && <ChangePwModal onClose={hidePwModalHandler} />}
      {confirmReboot && <ConfirmModal confirmText='Reboot?' onClose={hideRebootModalHandler} confirmEndpoint='/reboot' />}
      {confirmShutdown && (
        <ConfirmModal confirmText='Shutdown?' onClose={hideShutdownModalHandler} confirmEndpoint='/shutdown' />
      )}
    </div>
  );
};

export default Settings;
