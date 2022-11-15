import ButtonWithSpinner from "components/ButtonWithSpinner/ButtonWithSpinner";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { checkError } from "utils/checkError";
import { instance } from "utils/interceptor";

const DebugLogBox: FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const onClickHandler = async () => {
    try {
      setIsLoading(true);
      const resp = await instance.get("/system/get-debug-logs-raw");
      const data = await resp.data;

      // Download file
      const blob = new Blob([data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const tmpLink = document.createElement("a");
      tmpLink.href = url;
      tmpLink.setAttribute("download", "debug_log.txt");
      tmpLink.click();
    } catch (e: any) {
      toast.error(checkError(e));
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  return (
    <div className="box-border w-full transition-colors dark:text-white">
      <article className="relative rounded bg-white p-5 shadow-xl dark:bg-gray-800">
        <div className="flex justify-between">
          <h4 className="flex w-1/2 items-center font-bold xl:w-2/3">
            {t("settings.generate_debug")}
          </h4>
          <ButtonWithSpinner
            loading={isLoading}
            onClick={onClickHandler}
            className="bd-button w-1/2 py-1 xl:w-1/3"
          >
            {t("settings.generate")}
          </ButtonWithSpinner>
        </div>
      </article>
    </div>
  );
};

export default DebugLogBox;
