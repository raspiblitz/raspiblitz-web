import { FC, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as MoonLogo } from '../../assets/moon.svg';
import { ReactComponent as RaspiBlitzLogo } from '../../assets/RaspiBlitz_Logo_Main.svg';
import { ReactComponent as RaspiBlitzLogoDark } from '../../assets/RaspiBlitz_Logo_Main_Negative.svg';
import { AppContext } from '../../store/app-context';

const Login: FC = () => {
  const appCtx = useContext(AppContext);
  const history = useHistory();
  const passwordInput = useRef<HTMLInputElement>(null);

  const loginHandler = async () => {
    // calculate SHA256 - see MDN
    const encoder = new TextEncoder();
    const data = encoder.encode(passwordInput.current?.value);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    const respObj = fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: hashHex
      })
    });
    const resp = await respObj;
    if (resp.status === 200) {
      const token = (await resp.json()).token;
      localStorage.setItem('access_token', token);
      appCtx.setIsLoggedIn(true);
      history.push('/home');
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <MoonLogo className='h-8 fixed right-4 top-4 text-dark dark:text-yellow-500' onClick={appCtx.toggleDarkMode} />
      <RaspiBlitzLogo className='h-10 my-2 block dark:hidden' />
      <RaspiBlitzLogoDark className='h-10 my-2 hidden dark:block' />
      <div className='flex flex-col py-5 w-8/12 md:w-96'>
        <input ref={passwordInput} type='password' placeholder='Enter Password A' className='input-underline' />
      </div>
      <button onClick={loginHandler} className='bg-yellow-500 rounded px-4 py-2 m-4 text-white hover:bg-yellow-400'>
        Login
      </button>
    </div>
  );
};

export default Login;
