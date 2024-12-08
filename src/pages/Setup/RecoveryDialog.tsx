import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupPhase } from "@/models/setup.model";
import { useTranslation } from "react-i18next";

type Props = {
	setupPhase: SetupPhase;
	callback: (start: boolean) => void;
};

export default function RecoveryDialog({ setupPhase, callback }: Props) {
	const { t } = useTranslation();

	const getHeadlineText = () => {
		if (setupPhase === SetupPhase.RECOVERY) return t("setup.start_recovery");
		if (setupPhase === SetupPhase.UPDATE) return t("setup.start_update");
		return "";
	};

	return (
		<SetupContainer currentStep={1}>
			<section className="flex h-full max-w-3xl flex-col items-center justify-center gap-y-8 lg:p-8">
				<Headline>{getHeadlineText()}</Headline>
				<article className="flex flex-col items-center justify-center gap-10 pt-10">
					<Button onClick={() => callback(true)} color="primary">
						{t("setup.yes")}
					</Button>
					<Button onClick={() => callback(false)} color="secondary">
						{t("setup.other_options")}
					</Button>
				</article>
			</section>
		</SetupContainer>
	);
}
