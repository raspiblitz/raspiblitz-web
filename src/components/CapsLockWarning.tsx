import { Alert } from "@/components/Alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const CapsLockWarning = () => {
  const { t } = useTranslation();
  return (
    <Alert as="p" color="warning">
      <ExclamationTriangleIcon className="size-4 inline" />
      &nbsp;
      {t("login.caps_lock")}
    </Alert>
  );
};

export default CapsLockWarning;
