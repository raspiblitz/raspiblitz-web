import { FC, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as MoonLogo } from "../assets/moon.svg";
import { ReactComponent as RaspiBlitzLogo } from "../assets/RaspiBlitz_Logo_Main.svg";
import { ReactComponent as RaspiBlitzLogoDark } from "../assets/RaspiBlitz_Logo_Main_Negative.svg";
import I18nDropdown from "../components/Shared/I18nDropdown/I18nDropdown";
import LoadingSpinner from "../components/Shared/LoadingSpinner/LoadingSpinner";
import { AppContext } from "../store/app-context";
import { instance } from "../util/interceptor";
import { enableGutter } from "../util/util";

const Login: FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isError, setIsError] = useState(false);
  const { isLoggedIn, setIsLoggedIn, darkMode, toggleDarkMode } =
    useContext(AppContext);
  const navigate = useNavigate();
  const passwordInput = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname || "/home";

  useEffect(() => {
    if (isLoggedIn) {
      return navigate(from || "/home", { replace: true });
    }
  }, [navigate, from, isLoggedIn]);

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();

    setIsUnauthorized(false);
    setIsError(false);
    setIsLoading(true);

    const password = passwordInput.current?.value;
    const resp = await instance
      .post("/system/login", { password })
      .catch((err) => {
        if (err.response.status === 401) {
          setIsUnauthorized(true);
        } else {
          setIsError(true);
        }
      });

    setIsLoading(false);

    if (resp) {
      localStorage.setItem("access_token", resp.data.access_token);
      setIsLoggedIn(true);
      enableGutter();
      navigate(from, { replace: true });
    }
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
          {isUnauthorized && (
            <p className="rounded bg-gray-200 px-5 py-2 text-red-500">
              {t("login.invalid_pass")}
            </p>
          )}
          {isError && (
            <p className="rounded bg-gray-200 px-5 py-2 text-red-500">
              {t("login.error")}
            </p>
          )}
        </>
      )}
    </main>
  );
};

export default Login;
