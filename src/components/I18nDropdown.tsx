import { ChangeEvent, FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { resources } from "../i18n/config";
import { saveSettings } from "../util";

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
    <select
      id="lngSelect"
      ref={selectRef}
      onChange={dropdownHandler}
      className="w-auto border bg-white dark:text-black"
    >
      {langs.map((lang) => {
        return (
          <option key={lang} value={lang}>
            {t(`language.${lang}`)}
          </option>
        );
      })}
    </select>
  );
};

export default I18nDropdown;
