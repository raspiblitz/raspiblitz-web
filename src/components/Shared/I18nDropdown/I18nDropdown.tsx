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
    <>
      <label htmlFor="lngSelect" className="font-bold w-1/2 dark:text-white">
        {t("settings.language")}
      </label>
      <select
        id="lngSelect"
        ref={selectRef}
        onChange={dropdownHandler}
        className="border w-1/2 dark:text-black bg-white"
      >
        {langs.map((lang, i) => {
          return (
            <option key={i} value={lang}>
              {lang}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default I18nDropdown;
