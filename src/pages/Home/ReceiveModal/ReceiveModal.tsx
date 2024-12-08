import { TxType } from "../SwitchTxType";
import QRCode from "./QRCode";
import ReceiveLN, { type IFormInputs } from "./ReceiveLN";
import { Alert } from "@/components/Alert";
import {
  ConfirmModal,
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import { AppContext, Unit } from "@/context/app-context";
import { checkError } from "@/utils/checkError";
import { convertBtcToSat } from "@/utils/format";
import { instance } from "@/utils/interceptor";
import { Tabs, Tab } from "@nextui-org/tabs";
import type { FC } from "react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

const ReceiveModal: FC<Pick<ConfirmModalProps, "disclosure">> = ({
  disclosure,
}) => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);

  const [invoiceType, setInvoiceType] = useState<TxType>(TxType.LIGHTNING);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState("");
  const [address, setAddress] = useState("");

  const generateInvoiceHandler = (data: IFormInputs) => {
    const { commentInput, amountInput } = {
      ...data,
      amountInput: Number(data.amountInput),
    };

    setInvoice("");
    setIsLoading(true);

    const mSatAmount =
      unit === Unit.BTC
        ? convertBtcToSat(amountInput) * 1000
        : amountInput * 1000;

    instance
      .post(
        `lightning/add-invoice?value_msat=${mSatAmount}&memo=${commentInput}`,
      )
      .then((resp) => {
        setInvoice(resp.data.payment_request);
      })
      .catch((err) => {
        setError(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const generateOnChainAddressHandler = async () => {
    setAddress("");
    setIsLoading(true);

    await instance
      .post("lightning/new-address", {
        type: "p2wkh",
      })
      .then((resp) => {
        setAddress(resp.data);
      })
      .catch((err) => {
        setError(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTabChange = (key: React.Key) => {
    setInvoiceType(key as TxType);
    setError("");

    if (key == TxType.ONCHAIN && !address) {
      generateOnChainAddressHandler();
    }
  };

  return (
    <ConfirmModal disclosure={disclosure} custom>
      <>
        <ConfirmModal.Header>{t("wallet.receive")}</ConfirmModal.Header>

        <div className="mx-6">
          <Tabs
            classNames={{
              tabList: "flex-col md:flex-row",
            }}
            fullWidth
            aria-label={t("wallet.receive_aria_options")}
            selectedKey={invoiceType}
            onSelectionChange={handleTabChange}
          >
            <Tab key={TxType.LIGHTNING} title={t("wallet.create_invoice_ln")}>
              {invoice ? (
                <ConfirmModal.Body>
                  <QRCode address={invoice} />
                </ConfirmModal.Body>
              ) : (
                <ReceiveLN
                  onSubmitHandler={generateInvoiceHandler}
                  isLoading={isLoading}
                  error={error}
                />
              )}
            </Tab>
            <Tab key={TxType.ONCHAIN} title={t("wallet.fund")}>
              <ConfirmModal.Body>
                {!address && error && <Alert color="danger">{error}</Alert>}

                {address && !error && (
                  <QRCode
                    address={address}
                    onRefreshHandler={generateOnChainAddressHandler}
                  />
                )}
              </ConfirmModal.Body>
            </Tab>
          </Tabs>
        </div>
      </>
    </ConfirmModal>
  );
};

export default ReceiveModal;
