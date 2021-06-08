import { FC, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../store/app-context';

const Login: FC = () => {
  const appCtx = useContext(AppContext);
  const history = useHistory();

  const loginHandler = () => {
    appCtx.setIsLoggedIn(true);
    history.push('/home');
  };

  console.log(appCtx.isLoggedIn);

  return (
    <div>
      Enter Password A:
      <input type='password' placeholder='Enter Password A' />
      <button onClick={loginHandler}>Login</button>
    </div>
  );
};

export default Login;
