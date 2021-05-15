import { FC } from 'react';
import { useHistory } from 'react-router';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';

const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const history = useHistory();
  const btnClasses =
    'text-center h-10 mx-2 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 rounded-lg w-1/2 text-white';

  const shutdownHandler = async () => {
    const respObj = fetch('http://localhost:8081' + props.confirmEndpoint, {
      method: 'POST',
      body: JSON.stringify({})
    });
    const status = await (await respObj).status;
    if (status === 200) {
      // TODO: logout
      history.push('/home');
    }
  };

  return (
    <ModalDialog close={props.onClose}>
      {props.confirmText}
      <div className='py-3 flex'>
        <button className={btnClasses} onClick={props.onClose}>
          Cancel
        </button>
        <button className={btnClasses} onClick={shutdownHandler}>
          Yes
        </button>
      </div>
    </ModalDialog>
  );
};

export default ConfirmModal;

export interface ConfirmModalProps {
  confirmText: string;
  confirmEndpoint: string;
  onClose: () => void;
}
