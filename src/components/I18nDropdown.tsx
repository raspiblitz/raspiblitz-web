import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { resources } from "@/i18n/config";
import { saveSettings } from "@/utils";
import { Select, SelectItem } from "@nextui-org/react";

const I18nDropdown: FC = () => {
  const { t, i18n } = useTranslation();

  const langs = Object.keys(resources);

  const onSelectionChangeHandler = (event: any) => {
    i18n.changeLanguage(event);
    saveSettings({ lang: i18n.language });
  };

  return (
    <Select
      label={t("settings.language")}
      selectedKeys={[i18n.language]}
      onSelectionChange={onSelectionChangeHandler}
      className="max-w-xs"
    >
      {langs.map((lang) => (
        <SelectItem key={lang} value={lang}>
          {t(`language.${lang}`)}
        </SelectItem>
      ))}
    </Select>
  );
};

export default I18nDropdown;
