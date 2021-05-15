import { FC } from 'react';
import ModalDialog from '../../../../container/ModalDialog/ModalDialog';

export const TransactionDetailModal: FC<{ close: () => void }> = (props) => {
  return (
    <ModalDialog close={props.close}>
      <div className='flex'>
        <div className='w-full'>
          <div>TxID</div>
          <a
            className='text-blue-400 underline break-all'
            target='_blank'
            rel='noreferrer'
            href='https://mempool.space/tx/e6f4d98fb6955bed65eda930797b30646cbfb0c6fed809f1cf2022a7d7c299ce'
          >
            e6f4d98fb6955bed65eda930797b30646cbfb0c6fed809f1cf2022a7d7c299ce
          </a>
        </div>
      </div>
    </ModalDialog>
  );
};

export default TransactionDetailModal;
