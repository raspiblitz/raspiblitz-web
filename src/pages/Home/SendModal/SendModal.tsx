import {
  ConfirmModal,
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import type { DecodePayRequest } from "@/models/decode-pay-req";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { Tab, Tabs } from "@heroui/react";
import type { AxiosResponse } from "axios";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { TxType } from "../SwitchTxType";
import ConfirmSend from "./ConfirmSend";
import SendLn, { type LnInvoiceForm } from "./SendLN";
import SendOnChain, { type SendOnChainForm } from "./SendOnChain";

export interface Props extends Pick<ConfirmModalProps, "disclosure"> {
  lnBalance: number;
  onchainBalance: number;
}

export interface SendLnForm {
  invoiceType: TxType.LIGHTNING;
  invoice: string;
  address: string;
  amount: number;
  comment: string;
  timestamp: number;
  expiry: number;
}

const SendModal: FC<Props> = ({ lnBalance, disclosure, onchainBalance }) => {
  const { t } = useTranslation();
  const [confirmData, setConfirmData] = useState<
    SendOnChainForm | SendLnForm | null
  >(null);
  const [isBack, setIsBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = () => {
    setConfirmData(null);
    setError("");
  };

  const confirmLnHandler = async (data: LnInvoiceForm) => {
    setIsLoading(true);
    setIsBack(false);
    setError("");
    await instance
      .get("/lightning/decode-pay-req", {
        params: {
          pay_req: data.invoice,
        },
      })
      .then((resp: AxiosResponse<DecodePayRequest>) => {
        setConfirmData({
          invoiceType: TxType.LIGHTNING,
          invoice: data.invoice,
          address: resp.data.payment_addr,
          amount: resp.data.num_msat,
          timestamp: resp.data.timestamp,
          expiry: resp.data.expiry,
          comment: resp.data.description,
        });
      })
      .catch((err) => {
        setError(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmOnChainHandler = (data: SendOnChainForm): void => {
    setIsBack(false);
    setConfirmData(data);
  };

  const backHandler = (data: SendOnChainForm | SendLnForm): void => {
    setIsBack(true);
    setConfirmData(data);
  };

  return (
    <ConfirmModal disclosure={disclosure} custom>
      <>
        <ConfirmModal.Header>{t("wallet.send")}</ConfirmModal.Header>

        <div className="mx-6">
          <Tabs
            fullWidth
            aria-label={t("wallet.receive_aria_options")}
            onSelectionChange={handleTabChange}
          >
            <Tab key={TxType.LIGHTNING} title={t("wallet.send_lightning")}>
              {!isBack && confirmData ? (
                <ConfirmSend
                  confirmData={confirmData}
                  back={backHandler}
                  balance={lnBalance}
                  close={disclosure.onClose}
                />
              ) : (
                <SendLn
                  isLoading={isLoading}
                  onConfirm={confirmLnHandler}
                  lnBalance={lnBalance}
                  confirmData={confirmData}
                  error={error}
                />
              )}
            </Tab>
            <Tab key={TxType.ONCHAIN} title={t("wallet.send_onchain")}>
              {!isBack && confirmData ? (
                <ConfirmSend
                  confirmData={confirmData}
                  back={backHandler}
                  balance={lnBalance}
                  close={disclosure.onClose}
                />
              ) : (
                <SendOnChain
                  balance={onchainBalance}
                  confirmData={confirmData}
                  onConfirm={confirmOnChainHandler}
                />
              )}
            </Tab>
          </Tabs>
        </div>
      </>
    </ConfirmModal>
  );
};

export default SendModal;
