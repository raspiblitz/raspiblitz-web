import { ChangeEvent, FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { resources } from "../../../i18n/config";
import { saveSettings } from "../../../util/util";

const I18nDropdown: FC = () => {
  const { t, i18n } = useTranslation();
  const selectRef = useRef<HTMLSelectElement>(null);

  const langs = Object.keys(resources);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = i18n.language;
    }
  }, [i18n]);

  const dropdownHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value !== i18n.language) {
      i18n.changeLanguage(selectRef.current?.value);
      saveSettings({ lang: i18n.language });
    }
  };

  return (
    <article className="flex justify-between">
      <label htmlFor="lngSelect" className="w-1/2 font-bold dark:text-white">
        {t("settings.language")}
      </label>
      <select
        id="lngSelect"
        ref={selectRef}
        onChange={dropdownHandler}
        className="w-1/2 border bg-white dark:text-black xl:w-1/3"
      >
        {langs.map((lang) => {
          return (
            <option key={lang} value={lang}>
              {lang}
            </option>
          );
        })}
      </select>
    </article>
  );
};

export default I18nDropdown;
