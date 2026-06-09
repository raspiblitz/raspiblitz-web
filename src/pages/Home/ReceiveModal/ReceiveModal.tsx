import { Tabs } from "@heroui/react";
import { type FC, type Key, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/Alert";
import {
  ConfirmModal,
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import { AppContext, Unit } from "@/context/app-context";
import { checkError } from "@/utils/checkError";
import { convertBtcToSat } from "@/utils/format";
import { instance } from "@/utils/interceptor";
import { TxType } from "../SwitchTxType";
import QRCode from "./QRCode";
import ReceiveLN, { type IFormInputs } from "./ReceiveLN";

const ReceiveModal: FC<Pick<ConfirmModalProps, "disclosure">> = ({
  disclosure,
}) => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);

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

  const handleTabChange = async (key: Key) => {
    setError("");

    // biome-ignore lint/suspicious/noDoubleEquals: value is expected to exist at this point
    if (key == TxType.ONCHAIN && !address) {
      await generateOnChainAddressHandler();
    }
  };

  return (
    <ConfirmModal disclosure={disclosure} custom>
      <ConfirmModal.Header>{t("wallet.receive")}</ConfirmModal.Header>

      <div className="mx-6">
        <Tabs
          aria-label={t("wallet.receive_aria_options")}
          onSelectionChange={handleTabChange}
        >
          <Tabs.List className="flex-col md:flex-row">
            <Tabs.Tab id={TxType.LIGHTNING}>
              {t("wallet.create_invoice_ln")}
            </Tabs.Tab>
            <Tabs.Tab id={TxType.ONCHAIN}>{t("wallet.fund")}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id={TxType.LIGHTNING}>
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
          </Tabs.Panel>
          <Tabs.Panel id={TxType.ONCHAIN}>
            <ConfirmModal.Body>
              {!address && error && <Alert color="danger">{error}</Alert>}

              {address && !error && (
                <QRCode
                  address={address}
                  onRefreshHandler={generateOnChainAddressHandler}
                />
              )}
            </ConfirmModal.Body>
          </Tabs.Panel>
        </Tabs>
      </div>
    </ConfirmModal>
  );
};

export default ReceiveModal;
