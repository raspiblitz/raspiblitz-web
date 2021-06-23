import { FC, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useHistory } from 'react-router';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';
import { AppContext } from '../../../store/app-context';
import { createRequest } from '../../../util/util';

const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const appCtx = useContext(AppContext);
  const history = useHistory();
  const btnClasses = 'text-center h-10 m-2 bg-yellow-500 hover:bg-yellow-400 rounded w-1/2 text-white';

  const shutdownHandler = async () => {
    const req = createRequest(props.confirmEndpoint, 'POST');
    const resp = fetch(req);
    const status = await (await resp).status;
    if (status === 200) {
      appCtx.setIsLoggedIn(false);
      history.push('/login');
    }
  };

  return createPortal(
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
    </ModalDialog>,
    document.getElementById('modal-root')!
  );
};

export default ConfirmModal;

export interface ConfirmModalProps {
  confirmText: string;
  confirmEndpoint: string;
  onClose: () => void;
}
