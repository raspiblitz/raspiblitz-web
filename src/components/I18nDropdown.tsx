import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resources } from "@/i18n/config";
import { saveSettings } from "@/utils";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const I18nDropdown: FC = () => {
  const { t, i18n } = useTranslation();

  const langs = Object.keys(resources);

  const changeLanguage = async (value: string) => {
    if (value !== i18n.language) {
      await i18n.changeLanguage(value);
      saveSettings({ lang: value });
    }
  };

  return (
    <Select onValueChange={changeLanguage}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t(`language.${i18n.language}`)} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {langs.map((lang) => {
            return (
              <SelectItem key={lang} value={lang}>
                {t(`language.${lang}`)}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default I18nDropdown;
