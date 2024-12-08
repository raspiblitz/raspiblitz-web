import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { Input, useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";

type Props = {
	passwordType: PasswordColors;
	callback: (password: string | null) => void;
};

interface IFormInputs {
	passfirst: string;
	passrepeat: string;
}

const passwordColors = {
	a: "text-danger",
	b: "text-primary",
	c: "text-warning",
};

type PasswordColors = keyof typeof passwordColors;

export default function InputPassword({ passwordType, callback }: Props) {
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<IFormInputs>({
		mode: "onChange",
	});

	const continueHandler = (data: IFormInputs) => {
		callback(data.passfirst);
		reset();
	};

	const confirmModal = useDisclosure();

	return (
		<>
			<ConfirmModal
				disclosure={confirmModal}
				headline={`${t("setup.cancel_setup")}?`}
				onConfirm={() => callback(null)}
			/>

			<SetupContainer currentStep={4}>
				<section className="flex h-full flex-col items-center justify-center p-8">
					<Headline>
						<Trans
							i18nKey={`setup.password_${passwordType}_short`}
							t={t}
							components={[
								<strong
									key="passwordType"
									className={`font-semibold ${passwordColors[passwordType]}`}
								/>, // if needed, create a component for this
							]}
						/>
					</Headline>

					<p className="m-2 text-center text-secondary">
						<Trans
							i18nKey={`setup.password_${passwordType}_details`}
							t={t}
							components={[
								<strong
									key="passwordType"
									className={`font-semibold ${passwordColors[passwordType]}`}
								/>, // if needed, create a component for this
							]}
						/>
					</p>

					<form onSubmit={handleSubmit(continueHandler)} className="w-full">
						<fieldset className="flex w-full flex-col gap-4">
							<Input
								className="w-full"
								classNames={{
									inputWrapper:
										"bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
								}}
								type="password"
								label={t(`setup.password_${passwordType}_name`)}
								isInvalid={!!errors.passfirst}
								errorMessage={errors.passfirst?.message}
								{...register("passfirst", {
									required: t("setup.password_error_empty"),
									pattern: {
										value: /^[a-zA-Z0-9.-]*$/,
										message: t("setup.password_error_chars"),
									},
									minLength: {
										value: 8,
										message: t("setup.password_error_length"),
									},
								})}
							/>

							<Input
								className="w-full"
								classNames={{
									inputWrapper:
										"bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
								}}
								type="password"
								label={`${t("setup.password_repeat")} ${t(`setup.password_${passwordType}_name`)}`}
								isInvalid={!!errors.passrepeat}
								errorMessage={errors.passrepeat?.message}
								{...register("passrepeat", {
									required: t("setup.password_error_empty"),
									validate: (value) =>
										value === watch("passfirst") ||
										t("setup.password_error_match"),
								})}
							/>
						</fieldset>

						<article className="flex flex-col items-center justify-center gap-10 pt-10">
							<Button type="submit" isDisabled={!isValid} color="primary">
								{t("setup.continue")}
							</Button>
							<Button
								type="button"
								color="secondary"
								onClick={() => confirmModal.onOpen()}
							>
								{t("setup.cancel")}
							</Button>
						</article>
					</form>
				</section>
			</SetupContainer>
		</>
	);
}
