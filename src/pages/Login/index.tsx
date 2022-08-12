import { FC, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as MoonLogo } from "../../assets/moon.svg";
import { ReactComponent as RaspiBlitzLogo } from "../../assets/RaspiBlitz_Logo_Main.svg";
import { ReactComponent as RaspiBlitzLogoDark } from "../../assets/RaspiBlitz_Logo_Main_Negative.svg";
import I18nDropdown from "../../components/Shared/I18nDropdown/I18nDropdown";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";
import Message from "../../container/Message/Message";
import { AppContext } from "../../store/app-context";
import { checkError } from "../../util/checkError";
import { instance } from "../../util/interceptor";
import { ACCESS_TOKEN, enableGutter } from "../../util/util";

const Login: FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn, setIsLoggedIn, darkMode, toggleDarkMode } =
    useContext(AppContext);
  const navigate = useNavigate();
  const passwordInput = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname || "/home";
  const queryParams = new URLSearchParams(window.location.search);
  const back = queryParams.get("back");

  useEffect(() => {
    if (isLoggedIn) {
      if (back) {
        console.log(`back(${back})`);
        return navigate(back, { replace: true });
      } else {
        console.log(`from(${from})`);
        return navigate(from || "/home", { replace: true });
      }
    }
  }, [navigate, from, isLoggedIn, back]);

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    const password = passwordInput.current?.value;
    await instance
      .post("/system/login", { password })
      .then((resp) => {
        localStorage.setItem(ACCESS_TOKEN, resp.data.access_token);
        setIsLoggedIn(true);
        enableGutter();
        if (back) {
          console.log(`back(${back})`);
          navigate(back, { replace: true });
        } else {
          console.log(`from(${from})`);
          navigate(from, { replace: true });
        }
      })
      .catch((err) => setError(checkError(err)))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 transition-colors dark:bg-gray-700">
      <MoonLogo
        className="text-dark fixed right-4 top-4 h-8 dark:text-yellow-500"
        onClick={toggleDarkMode}
      />
      <div className="fixed right-16 top-4 flex h-8 w-48 items-center justify-around">
        <I18nDropdown />
      </div>
      {!darkMode && <RaspiBlitzLogo className="my-2 block h-10" />}
      {darkMode && <RaspiBlitzLogoDark className="my-2 block h-10" />}
      {isLoading && (
        <div className="py-5">
          <LoadingSpinner color="text-yellow-500" />
        </div>
      )}
      {!isLoading && (
        <>
          <form
            className="items-left flex flex-col justify-center py-5"
            onSubmit={loginHandler}
          >
            <label className="label-underline">{t("login.enter_pass")}</label>
            <input
              autoFocus
              className="input-underline my-5 w-8/12 md:w-96"
              placeholder={t("login.enter_pass_placeholder")}
              ref={passwordInput}
              type="password"
            />
            <button
              type="submit"
              className="m-4 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-400"
            >
              {t("login.login")}
            </button>
          </form>
          {error && <Message message={error} />}
        </>
      )}
    </main>
  );
};

export default Login;
