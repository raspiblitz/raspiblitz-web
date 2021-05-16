import { FC, useEffect, useState } from 'react';
import ModalDialog from '../../../../container/ModalDialog/ModalDialog';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';
import LNDetails from './LNDetails/LNDetails';
import OnchainDetails from './OnchainDetails/OnchainDetails';

export const TransactionDetailModal: FC<TransactionDetailModalProps> = (props) => {
  const [txDetails, setTxDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const { id } = props;

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const req = await fetch('http://localhost:8081/tx/' + id);

      const reqObj = await req.json();
      setIsLoading(false);
      setTxDetails(reqObj);
    };

    fetchData();
  }, [id]);

  return (
    <ModalDialog close={props.close}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className='flex flex-col'>
          <div className='font-extrabold'>Transaction Details</div>
          <a
            className='text-blue-400 underline break-all py-2'
            target='_blank'
            rel='noreferrer'
            href='https://mempool.space/tx/e6f4d98fb6955bed65eda930797b30646cbfb0c6fed809f1cf2022a7d7c299ce'
          >
            View on Mempool
          </a>
          {txDetails.type === 'onchain' && <OnchainDetails details={txDetails} />}
          {txDetails.type === 'lightning' && <LNDetails details={txDetails} />}
        </div>
      )}
    </ModalDialog>
  );
};

export default TransactionDetailModal;

export interface TransactionDetailModalProps {
  id: string;
  close: () => void;
}
