import { FC, useState } from 'react';
import ModalDialog from '../../container/ModalDialog/ModalDialog';

const ChangePwModal: FC<ChangePwModalProps> = (props) => {
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const btnClasses =
    'text-center h-10 m-2 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 rounded-lg w-1/2 text-white';

  const changePasswordHandler = async () => {
    setIsLoading(true);
    const respObj = fetch('http://localhost:8081/changepw', {
      method: 'POST',
      body: JSON.stringify({
        password
      })
    });
    setIsLoading(false);
    const status = await (await respObj).status;
    if (status === 200) {
    }
  };

  return (
    <ModalDialog close={props.onClose}>
      <h3 className='font-bold'>Change Password</h3>
      <div className='py-3 flex flex-col'>
        <div>
          <label htmlFor='oldpw'>Old Pw</label>
          <input id='oldpw' className='rounded' type='password' />
        </div>
        <div>
          <label htmlFor='newpw'>New Pw</label>
          <input id='newpw' className='rounded' type='password' />
        </div>
        <div className='flex'>
          <button className={btnClasses} onClick={props.onClose}>
            Cancel
          </button>
          <button className={btnClasses} onClick={changePasswordHandler}>
            Change Password
          </button>
        </div>
      </div>
    </ModalDialog>
  );
};

export default ChangePwModal;

export interface ChangePwModalProps {
  onClose: () => void;
}
