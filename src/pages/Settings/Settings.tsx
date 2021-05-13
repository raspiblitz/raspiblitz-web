import { FC } from 'react';
import ActionBox from '../../container/ActionBox/ActionBox';

const Settings: FC = () => {
  const action = () => {};

  return (
    <div className='content-container flex flex-col w-full dark:text-white'>
      <ActionBox name='Change Password' actionName='Change' action={action} />
      <ActionBox name='Reboot' actionName='Reboot' action={action} />
      <ActionBox name='Shutdown' actionName='Shutdown' action={action} />
    </div>
  );
};

export default Settings;
