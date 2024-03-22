import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const CapsLockWarning = () => {
  const { t } = useTranslation();
  return (
    <p className="flex items-center gap-1 text-yellow-500">
      <ExclamationTriangleIcon className="size-4" />
      {t("login.caps_lock")}
    </p>
  );
};

export default CapsLockWarning;
