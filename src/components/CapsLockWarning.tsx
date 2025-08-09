import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/Alert";

const CapsLockWarning = () => {
  const { t } = useTranslation();
  return (
    <Alert as="p" color="warning">
      <ExclamationTriangleIcon className="inline size-4" />
      &nbsp;
      {t("login.caps_lock")}
    </Alert>
  );
};

export default CapsLockWarning;
