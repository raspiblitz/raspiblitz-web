import RaspiBlitzLogoDark from "@/assets/RaspiBlitz_Logo_Main_Negative.svg?react";
import { Alert } from "@/components/Alert";
import I18nSelect from "@/components/I18nDropdown";
import { AppContext } from "@/context/app-context";
import { ACCESS_TOKEN, enableGutter } from "@/utils";
import { ApiError, checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { AxiosError } from "axios";
import { FC, FormEvent, useContext, useEffect, useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface IFormInputs {
  passwordInput: string;
}

const Login: FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname || "/home";
  const queryParams = new URLSearchParams(window.location.search);
  const back = queryParams.get("back");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({ mode: "onChange" });

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

  const loginHandler: SubmitHandler<IFormInputs> = async (data: {
    passwordInput: string;
  }) => {
    setError("");
    setIsLoading(true);

    await instance
      .post("/system/login", { password: data.passwordInput })
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
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-700 transition-colors">
      <div className="fixed right-16 top-4 flex h-8 w-48 items-center justify-around">
        <I18nSelect />
      </div>

      <RaspiBlitzLogoDark className="my-2 block h-10" />

      {isLoading && <Spinner size="lg" />}

      {!isLoading && (
        <>
          <form
            className="items-left flex flex-col justify-center py-5"
            onSubmit={handleSubmit(loginHandler)}
          >
            <Input
              autoFocus
              className="w-8/12 md:w-96"
              classNames={{
                inputWrapper:
                  "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
              }}
              disabled={isLoading}
              type="password"
              label={t("login.enter_pass")}
              placeholder={t("login.enter_pass_placeholder")}
              isInvalid={!!errors.passwordInput}
              errorMessage={errors.passwordInput?.message}
              {...register("passwordInput", {
                required: t("forms.validation.login.required"),
              })}
            />

            <article className="flex flex-col items-center justify-center gap-10 pt-10">
              <Button
                color="primary"
                type="submit"
                isDisabled={isLoading || !isValid}
                isLoading={isLoading}
              >
                {t("login.login")}
              </Button>
            </article>
          </form>

          {error && <Alert color="danger">{error}</Alert>}
        </>
      )}
    </main>
  );
};

export default Login;
