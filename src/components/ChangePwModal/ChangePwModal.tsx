import { ChangeEvent, FC, useState } from 'react';
import ModalDialog from '../../container/ModalDialog/ModalDialog';
import LoadingSpinner from '../Shared/LoadingSpinner/LoadingSpinner';

const ChangePwModal: FC<ChangePwModalProps> = (props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const btnClasses =
    'text-center h-12 m-2 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 rounded-lg w-1/2 text-white';

  const changePasswordHandler = async () => {
    setIsLoading(true);
    const respObj = fetch('http://localhost:8081/changepw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    });
    const status = (await respObj).status;
    setIsLoading(false);
    if (status === 200) {
    }
  };

  const changeOldPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
  };

  const changeNewPasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  return (
    <ModalDialog close={props.onClose}>
      <h3 className='font-bold'>Change Password</h3>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className='my-5 flex flex-col justify-center text-center items-center'>
          <div className='w-full md:w-10/12 py-1'>
            <label htmlFor='oldpw' className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 text-left'>
              Old Pw
            </label>
            <input
              id='oldpw'
              className='w-full rounded dark:text-black'
              type='password'
              value={oldPassword}
              onChange={changeOldPasswordHandler}
              required
            />
          </div>
          <div className='w-full md:w-10/12 py-1'>
            <label htmlFor='newpw' className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 text-left'>
              New Pw
            </label>
            <input
              id='newpw'
              className='w-full rounded dark:text-black'
              type='password'
              value={newPassword}
              onChange={changeNewPasswordHandler}
              required
            />
          </div>
          <div className='flex w-2/3 pt-2'>
            <button className={btnClasses} onClick={props.onClose}>
              Cancel
            </button>
            <button className={btnClasses} onClick={changePasswordHandler}>
              Change Password
            </button>
          </div>
        </div>
      )}
    </ModalDialog>
  );
};

export default ChangePwModal;

export interface ChangePwModalProps {
  onClose: () => void;
}
