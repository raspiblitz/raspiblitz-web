import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SetupContainer from '../../../container/SetupContainer/SetupContainer';

const SetPasswords: FC = (props) => {
  const { t } = useTranslation();
  return (
    <SetupContainer>
      <div className='text-center whitespace-pre-line'>{t('setup.passwords.infotext')}</div>
      <div className='flex flex-col justify-between items-center my-3'>
        <div className='w-2/3 flex flex-col justify-between my-3'>
          <label className='label-underline'>{t('setup.passwords.pass_a')}</label>
          <input type='password' className='input-underline' />
        </div>
        <div className='w-2/3 flex flex-col justify-between my-3'>
          <label className='label-underline'>{t('setup.passwords.pass_b')}</label>
          <input type='password' className='input-underline' />
        </div>
        <div className='w-2/3 flex flex-col justify-between my-3'>
          <label className='label-underline'>{t('setup.passwords.pass_c')}</label>
          <input type='password' className='input-underline' />
        </div>
      </div>
    </SetupContainer>
  );
};

export default SetPasswords;
