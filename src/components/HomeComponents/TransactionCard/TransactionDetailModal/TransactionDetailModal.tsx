import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalDialog from '../../../../container/ModalDialog/ModalDialog';
import { createRequest } from '../../../../util/util';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';
import LNDetails from './LNDetails/LNDetails';
import OnchainDetails from './OnchainDetails/OnchainDetails';

export const TransactionDetailModal: FC<TransactionDetailModalProps> = (props) => {
  const { t } = useTranslation();
  const [txDetails, setTxDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const { id } = props;

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const req = createRequest(`tx/${id}`, 'GET');
      const resp = await fetch(req);

      const respObj = await resp.json();
      setIsLoading(false);
      setTxDetails(respObj);
    };

    fetchData();
  }, [id]);

  return (
    <ModalDialog close={props.close}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className='flex flex-col'>
          <div className='font-extrabold'>{t('tx.tx_details')}</div>
          {txDetails.type === 'onchain' && (
            <a
              className='text-blue-400 underline break-all py-2'
              target='_blank'
              rel='noreferrer'
              href={`https://mempool.space/tx/${txDetails.hash}`}
            >
              {t('tx.mempool')}
            </a>
          )}
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
