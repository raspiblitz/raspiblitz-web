import { resources } from "@/i18n/config";
import { saveSettings } from "@/utils";
import { Select, SelectItem } from "@nextui-org/react";
import type { ChangeEvent, FC } from "react";
import { useTranslation } from "react-i18next";

const I18nSelect: FC = () => {
  const { t, i18n } = useTranslation();

  const langs = Object.keys(resources);

  const selectLangHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === i18n.language) {
      return;
    }

    i18n.changeLanguage(event.target.value);
    saveSettings({ lang: i18n.language });
  };

  return (
    <Select
      id="lngSelect"
      aria-label="Select language"
      defaultSelectedKeys={[i18n.language]}
      onChange={selectLangHandler}
      classNames={{
        trigger: "bg-tertiary",
      }}
    >
      {langs.map((lang) => {
        return (
          <SelectItem key={lang} value={lang}>
            {t(`language.${lang}`)}
          </SelectItem>
        );
      })}
    </Select>
  );
};

export default I18nSelect;
