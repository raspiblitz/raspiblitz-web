import { Button } from "@/components/Button";
import { AppContext } from "@/context/app-context";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { type FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

/**
 * Displays a button to generate a debug report which is downloaded as a file
 */
const DebugLogBox: FC = () => {
  const { t } = useTranslation();
  const { isGeneratingReport, setIsGeneratingReport } = useContext(AppContext);

  const onClickHandler = async () => {
    try {
      setIsGeneratingReport(true);
      const loadingToast = toast.info(t("settings.generating_debug_report"), {
        isLoading: true,
      });
      const resp = await instance.get("/system/get-debug-logs-raw");
      const data = await resp.data.raw_data;

      // Download file
      const blob = new Blob([data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const tmpLink = document.createElement("a");
      tmpLink.href = url;
      tmpLink.setAttribute("download", "debug_log.txt");
      tmpLink.click();
      toast.dismiss(loadingToast);
      toast.info(t("settings.debug_report_done"));
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (e: any) {
      toast.error(checkError(e));
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="box-border w-full text-white transition-colors">
      <article className="relative rounded bg-gray-800 p-5 shadow-xl">
        <div className="flex justify-between">
          <h4 className="flex w-1/2 items-center font-bold xl:w-2/3">
            {t("settings.generate_debug")}
          </h4>
          <Button
            isLoading={isGeneratingReport}
            onClick={onClickHandler}
            color="secondary"
            variant="flat"
          >
            {isGeneratingReport
              ? t("settings.generating")
              : t("settings.generate")}
          </Button>
        </div>
      </article>
    </div>
  );
};

export default DebugLogBox;
