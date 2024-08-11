import I18nSelect from "@/components/I18nDropdown";
import { FC } from "react";
import { useTranslation } from "react-i18next";

/**
 * Displays the current language and allows the user to change it.
 */
const I18nBox: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="box-border w-full transition-colors text-white">
      <article className="relative rounded p-5 shadow-xl bg-gray-800">
        <div className="flex justify-between gap-2">
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
