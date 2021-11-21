import { ChangeEvent, FC, FormEvent, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../../store/app-context";
import AmountInput from "../../AmountInput/AmountInput";
import InputField from "../../InputField/InputField";

const SendOnChain: FC<SendOnChainProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);
  const {
    address,
    amount,
    balance,
    comment,
    fee,
    onChangeAddress,
    onChangeAmount,
    onChangeComment,
    onChangeFee,
    onConfirm,
  } = props;

  return (
    <form className="px-5" onSubmit={onConfirm}>
      <h3 className="text-xl font-bold">{t("wallet.send_onchain")}</h3>

      <div className="my-5">
        <span className="font-bold">{t("wallet.balance")}:&nbsp;</span>
        {balance} {appCtx.unit}
      </div>

      {/* <div className="my-5 flex flex-col justify-center text-center items-center">
        <div className="w-full md:w-10/12 py-1">
          <InputField
            isFormValid={true}
            id="address"
            label={t("wallet.address")}
            pattern="(1|3|bc1)\w+"
            placeholder="bc..."
            type="text"
            onChange={onChangeAddress}
            required={true}
            value={address}
          />
        </div>

        <div className="w-full md:w-10/12 py-1">
          <AmountInput amount={amount} onChangeAmount={onChangeAmount} />
        </div>

        <div className="w-full md:w-10/12 py-1">
          <InputField
            isFormValid={true}
            id="fee"
            label={t("tx.fee")}
            type="number"
            onChange={onChangeFee}
            required={true}
            value={fee}
            inputRightAddon="sat / vByte"
          />
        </div>

        <div className="w-full md:w-10/12 py-1">
          <InputField
            isFormValid={true}
            id="comment"
            label={t("tx.comment")}
            placeholder="Optional comment"
            type="text"
            onChange={onChangeComment}
            required={true}
            value={comment}
          />
        </div>
      </div> */}

      <div className="inline-block w-4/5 lg:w-3/12 align-top mb-5">
        <button
          type="submit"
          className="text-center h-10 bg-yellow-500 hover:bg-yellow-400 dark:hover:bg-yellow-400 rounded-lg text-white w-full"
        >
          {t("wallet.confirm")}
        </button>
      </div>
    </form>
  );
};

export default SendOnChain;

export interface SendOnChainProps {
  address: string;
  amount: number;
  balance: string;
  comment: string;
  fee: string;
  onChangeAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeAmount: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeComment: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeFee: (event: ChangeEvent<HTMLInputElement>) => void;
  onConfirm: (event: FormEvent) => void;
}
