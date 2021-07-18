import { FC, FormEvent, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ReactComponent as MoonLogo } from '../../assets/moon.svg';
import { ReactComponent as RaspiBlitzLogo } from '../../assets/RaspiBlitz_Logo_Main.svg';
import { ReactComponent as RaspiBlitzLogoDark } from '../../assets/RaspiBlitz_Logo_Main_Negative.svg';
import LoadingSpinner from '../../components/Shared/LoadingSpinner/LoadingSpinner';
import { AppContext } from '../../store/app-context';
import { instance } from '../../util/interceptor';

const Login: FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isError, setIsError] = useState(false);
  const appCtx = useContext(AppContext);
  const history = useHistory();
  const passwordInput = useRef<HTMLInputElement>(null);

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();
    setIsUnauthorized(false);
    setIsError(false);
    setIsLoading(true);
    const password = passwordInput.current?.value;
    const resp = await instance.post('/login', { password }).catch((err) => {
      if (err.response.status === 401) {
        setIsUnauthorized(true);
      } else {
        setIsError(true);
      }
    });
    setIsLoading(false);
    if (resp) {
      localStorage.setItem('access_token', resp.data.token);
      appCtx.setIsLoggedIn(true);
      history.push('/home');
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <MoonLogo className='h-8 fixed right-4 top-4 text-dark dark:text-yellow-500' onClick={appCtx.toggleDarkMode} />
      {!appCtx.darkMode && <RaspiBlitzLogo className='h-10 my-2 block' />}
      {appCtx.darkMode && <RaspiBlitzLogoDark className='h-10 my-2 block' />}
      {isLoading && (
        <div className='py-5'>
          <LoadingSpinner color='text-yellow-500' />
        </div>
      )}
      {!isLoading && (
        <>
          <form className='flex flex-col justify-center items-left py-5' onSubmit={loginHandler}>
            <label className='label-underline'>{t('login.enter_pass')}</label>
            <input
              ref={passwordInput}
              type='password'
              placeholder={t('login.enter_pass_placeholder')}
              className='input-underline my-5 w-8/12 md:w-96'
            />
            <button type='submit' className='bg-yellow-500 rounded px-4 py-2 m-4 text-white hover:bg-yellow-400'>
              {t('login.login')}
            </button>
          </form>
          {isUnauthorized && <p className='text-red-500 bg-gray-200 px-5 py-2 rounded'>{t('login.invalid_pass')}</p>}
          {isError && <p className='text-red-500 bg-gray-200 px-5 py-2 rounded'>{t('login.error')}</p>}
        </>
      )}
    </div>
  );
};

export default Login;
