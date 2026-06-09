import { ListBox, Select } from "@heroui/react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { resources } from "@/i18n/config";
import { saveSettings } from "@/utils";

const I18nSelect: FC = () => {
  const { t, i18n } = useTranslation();

  const langs = Object.keys(resources);

  return (
    <Select
      aria-label="Select language"
      selectedKey={i18n.language}
      onSelectionChange={(key) => {
        if (key && key !== i18n.language) {
          i18n.changeLanguage(String(key));
          saveSettings({ lang: i18n.language });
        }
      }}
    >
      <Select.Trigger className="bg-tertiary">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {langs.map((lang) => (
            <ListBox.Item
              key={lang}
              id={lang}
              textValue={t(`language.${lang}`)}
            >
              {t(`language.${lang}`)}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default I18nSelect;
