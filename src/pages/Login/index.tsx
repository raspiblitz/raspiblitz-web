import RaspiBlitzLogo from "@/assets/RaspiBlitz_Logo_Main.svg?react";
import RaspiBlitzLogoDark from "@/assets/RaspiBlitz_Logo_Main_Negative.svg?react";
import I18nDropdown from "@/components/I18nDropdown";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Message from "@/components/Message";
import { AppContext } from "@/context/app-context";
import { ACCESS_TOKEN, enableGutter } from "@/utils";
import { ApiError, checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import {
  ArrowLeftEndOnRectangleIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import { FC, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";

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
        // access_token was used in v1.8
        localStorage.setItem(ACCESS_TOKEN, resp.data.access_token || resp.data);
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
      .catch((err: AxiosError<ApiError>) => setError(checkError(err)))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 transition-colors dark:bg-gray-700">
      <MoonIcon
        className="text-dark fixed right-4 top-4 h-8 dark:text-yellow-500"
        onClick={toggleDarkMode}
      />
      <div className="fixed right-16 top-4 flex h-8 w-72 items-center justify-around">
        <article className="flex justify-between">
          <label
            htmlFor="lngSelect"
            className="mr-2 w-1/2 font-bold dark:text-white"
          >
            {t("settings.language")}
          </label>
          <I18nDropdown />
        </article>
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
            <Input
              autoFocus
              label={t("login.enter_pass")}
              className="my-5 w-8/12 md:w-96"
              placeholder={t("login.enter_pass_placeholder")}
              ref={passwordInput}
              type="password"
            />

            <Button type="submit" color="secondary">
              <ArrowLeftEndOnRectangleIcon className="mr-1 inline h-6 w-6 rotate-180" />
              <span>{t("login.login")}</span>
            </Button>
          </form>
          {error && <Message message={error} />}
        </>
      )}
    </main>
  );
};

export default Login;
