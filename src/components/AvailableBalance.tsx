import { AppContext, Unit } from "@/context/app-context";
import { convertSatToBtc, convertToString } from "@/utils/format";
import { type FC, useContext } from "react";
import { useTranslation } from "react-i18next";

type Props = {
	balance: number;
};

const AvailableBalance: FC<Props> = ({ balance }) => {
	const { unit } = useContext(AppContext);
	const { t } = useTranslation();

	const convertedBalance =
		unit === Unit.BTC
			? convertToString(unit, convertSatToBtc(balance))
			: convertToString(unit, balance);

	return (
		<p className="my-5">
			<span className="font-bold">
				{t("wallet.available_balance")}
				:&nbsp;
			</span>
			{convertedBalance} {unit}
		</p>
	);
};

export default AvailableBalance;
