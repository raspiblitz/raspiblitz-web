import { FC, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';
import { AppContext } from '../../../store/app-context';
import { instance } from '../../../util/interceptor';

const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);
  const history = useHistory();
  const btnClasses = 'w-full xl:w-1/2 text-center h-10 my-2 bg-yellow-500 hover:bg-yellow-400 rounded text-white';

  const shutdownHandler = async () => {
    const resp = await instance.post(props.confirmEndpoint);
    if (resp.status === 200) {
      appCtx.setIsLoggedIn(false);
      history.push('/login');
    }
  };

  return createPortal(
    <ModalDialog close={props.onClose}>
      {props.confirmText}
      <div className='py-3 flex flex-col xl:flex-row'>
        <button className={btnClasses} onClick={props.onClose}>
          {t('settings.cancel')}
        </button>
        <button className={btnClasses} onClick={shutdownHandler}>
          {t('settings.confirm')}
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
