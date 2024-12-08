import { Button } from "@/components/Button";
import I18nSelect from "@/components/I18nDropdown";
import Stepper from "@/pages/Setup/Stepper";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import type { PropsWithChildren } from "react";

type Props = {
	currentStep: number | null;
};

export default function SetupContainer({
	currentStep,
	children,
}: PropsWithChildren<Props>) {
	return (
		<main className="flex h-full min-h-screen w-screen flex-col items-center justify-center bg-primary-900 text-white transition-colors">
			<div className="fixed top-16 flex h-8 w-48 flex-col-reverse items-center justify-center gap-6 md:right-16 md:top-6 md:w-96 md:flex-row md:gap-4">
				<Button
					as="a"
					href="https://docs.raspiblitz.org/"
					target="_blank"
					rel="noreferrer"
					color="primary"
					variant="ghost"
					className="w-full p-4"
					startContent={<BookOpenIcon className="h-5 w-5" />}
				>
					Documentation
				</Button>
				<I18nSelect />
			</div>

			{currentStep !== null && (
				<div className="fixed top-20 mb-4 flex w-1/3 items-center justify-around">
					<Stepper currentStep={currentStep} />
				</div>
			)}

			<div>{children}</div>
		</main>
	);
}
