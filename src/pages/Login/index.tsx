import RaspiBlitzLogoDark from "@/assets/RaspiBlitz_Logo_Main_Negative.svg?react";
import I18nSelect from "@/components/I18nDropdown";
import { AppContext } from "@/context/app-context";
import { ACCESS_TOKEN, enableGutter } from "@/utils";
import { ApiError, checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import { AxiosError } from "axios";
import { FC, useContext, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface IFormInputs {
  password: string;
}

const Login: FC = () => {
  const { t } = useTranslation();
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<IFormInputs>({ mode: "onChange" });

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

  const loginHandler: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const resp = await instance.post("/system/login", {
        password: data.password,
      });

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
    } catch (err) {
      setError("password", {
        type: "server",
        message: checkError(err as AxiosError<ApiError>),
      });
      setFocus("password");
    }
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-700 transition-colors">
      <div className="fixed right-16 top-4 flex h-8 w-48 items-center justify-around">
        <I18nSelect />
      </div>

      <RaspiBlitzLogoDark className="my-2 block h-10" />

      <form
        className="flex w-full max-w-sm flex-col justify-center py-5"
        onSubmit={handleSubmit(loginHandler)}
      >
        <Input
          autoFocus
          type="password"
          label={t("login.enter_pass")}
          placeholder={t("login.enter_pass_placeholder")}
          classNames={{
            inputWrapper:
              "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
          }}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          {...register("password", {
            required: t("forms.validation.unlock.required"),
          })}
        />

        <Button
          type="submit"
          color="primary"
          className="mt-4"
          isLoading={isSubmitting}
        >
          {t("login.login")}
        </Button>
      </form>
    </main>
  );
};

export default Login;
