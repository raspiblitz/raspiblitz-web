import { BoltIcon, LinkIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

export enum TxType {
	ONCHAIN = 0,
	LIGHTNING = 1,
}

export type Props = {
	disabled?: boolean;
	invoiceType: TxType;
	onTxTypeChange: (txtype: TxType) => void;
};

const SwitchTxType: FC<Props> = ({ invoiceType, onTxTypeChange, disabled }) => {
	const { t } = useTranslation();

	const setTxTypeHandler = (txType: TxType) => {
		if (disabled) {
			return;
		}
		onTxTypeChange(txType);
	};

	return (
		<div className="my-3">
			<button
				type="button"
				name="lightning"
				disabled={invoiceType === TxType.LIGHTNING}
				className="switch-button"
				onClick={() => setTxTypeHandler(TxType.LIGHTNING)}
			>
				<BoltIcon className="mr-1 inline h-6 w-6 align-bottom" />
				{t("home.lightning")}
			</button>

			<button
				type="button"
				name="onchain"
				disabled={invoiceType === TxType.ONCHAIN}
				className="switch-button"
				onClick={() => setTxTypeHandler(TxType.ONCHAIN)}
			>
				<LinkIcon className="mr-1 inline h-6 w-6 rotate-45 transform align-bottom" />
				{t("wallet.on_chain")}
			</button>
		</div>
	);
};

export default SwitchTxType;
