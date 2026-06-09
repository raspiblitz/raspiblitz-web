import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import type { AxiosError } from "axios";
import { type FC, useContext, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import RaspiBlitzLogoDark from "@/assets/RaspiBlitz_Logo_Main_Negative.svg?react";
import { Alert } from "@/components/Alert";
import I18nSelect from "@/components/I18nDropdown";
import { AppContext } from "@/context/app-context";
import { ACCESS_TOKEN, enableGutter } from "@/utils";
import { type ApiError, checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";

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
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormInputs>({ mode: "onChange" });

  useEffect(() => {
    if (isLoggedIn) {
      if (back) {
        console.info(`back(${back})`);
        navigate(back, { replace: true });
      } else {
        console.info(`from(${from})`);
        navigate(from || "/home", { replace: true });
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
          console.info(`back(${back})`);
          navigate(back, { replace: true });
        } else {
          console.info(`from(${from})`);
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
            <Controller
              name="passwordInput"
              control={control}
              rules={{
                required: t("forms.validation.login.required"),
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className="w-8/12 md:w-96"
                  isInvalid={fieldState.invalid}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  isDisabled={isLoading}
                >
                  <Label>{t("login.enter_pass")}</Label>
                  <Input
                    autoFocus
                    type="password"
                    placeholder={t("login.enter_pass_placeholder")}
                    className="bg-tertiary"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />

            <article className="flex flex-col items-center justify-center gap-10 pt-10">
              <Button
                variant="primary"
                type="submit"
                isDisabled={isLoading || !isValid}
                isPending={isLoading}
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
