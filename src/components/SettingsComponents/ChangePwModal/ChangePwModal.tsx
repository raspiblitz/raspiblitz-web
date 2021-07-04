import { ChangeEvent, FC, useState } from 'react';
import { createPortal } from 'react-dom';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';
import { createRequest } from '../../../util/util';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner';

const ChangePwModal: FC<ChangePwModalProps> = (props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const btnClasses = 'w-full xl:w-1/2 text-center h-10 m-2 bg-yellow-500 hover:bg-yellow-400 rounded text-white';

  const changePasswordHandler = async () => {
    setIsLoading(true);
    const req = createRequest('changepw', 'POST', JSON.stringify({ oldPassword, newPassword }));
    const resp = fetch(req);
    const status = (await resp).status;
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

  return createPortal(
    <ModalDialog close={props.onClose}>
      <h3 className='font-bold'>Change Password</h3>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className='my-5 flex flex-col justify-center text-center items-center'>
          <div className='w-full md:w-10/12 py-1'>
            <label htmlFor='oldpw' className='label-underline'>
              Old Password
            </label>
            <input
              id='oldpw'
              className='w-full input-underline'
              type='password'
              value={oldPassword}
              onChange={changeOldPasswordHandler}
              required
            />
          </div>
          <div className='w-full md:w-10/12 py-1'>
            <label htmlFor='newpw' className='label-underline'>
              New Password
            </label>
            <input
              id='newpw'
              className='w-full input-underline'
              type='password'
              value={newPassword}
              onChange={changeNewPasswordHandler}
              required
            />
          </div>
          <div className='flex flex-col xl:flex-row w-full md:w-2/3 pt-2 text-white'>
            <button className={btnClasses} onClick={props.onClose}>
              Cancel
            </button>
            <button className={btnClasses} onClick={changePasswordHandler}>
              Change Password
            </button>
          </div>
        </div>
      )}
    </ModalDialog>,
    document.getElementById('modal-root')!
  );
};

export default ChangePwModal;

export interface ChangePwModalProps {
  onClose: () => void;
}
