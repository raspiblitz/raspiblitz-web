import { FC } from "react";
import { useTranslation } from "react-i18next";
import I18nSelect from "@/components/I18nDropdown";

/**
 * Displays the current language and allows the user to change it.
 */
const I18nBox: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="box-border w-full transition-colors dark:text-white">
      <article className="relative rounded bg-white p-5 shadow-xl dark:bg-gray-800">
        <div className="flex justify-between">
          <h4 className="flex w-1/2 items-center font-bold xl:w-2/3">
            {t("settings.curr_lang")}
          </h4>
          <I18nSelect />
        </div>
      </article>
    </div>
  );
};

export default I18nBox;
