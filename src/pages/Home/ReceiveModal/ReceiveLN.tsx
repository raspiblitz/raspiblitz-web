import { Alert } from "@/components/Alert";
import AmountInput from "@/components/AmountInput";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { stringToNumber } from "@/utils/format";
import { Input } from "@nextui-org/react";
import type { ChangeEvent, FC } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface IFormInputs {
	amountInput: string;
	commentInput: string;
}

export type Props = {
	isLoading: boolean;
	error: string;
	onSubmitHandler: (data: IFormInputs) => void;
};

const ReceiveLN: FC<Props> = ({ isLoading, error, onSubmitHandler }) => {
	const { t } = useTranslation();

	const [amount, setAmount] = useState(0);
	const [comment, setComment] = useState("");

	const commentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setComment(event.target.value);
	};

	const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setAmount(+event.target.value);
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, submitCount },
	} = useForm<IFormInputs>({
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<IFormInputs> = (data) => onSubmitHandler(data);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ConfirmModal.Body>
				<fieldset className="flex w-full flex-col gap-4">
					<div className="flex flex-col justify-center pb-5 text-center">
						<AmountInput
							amount={amount}
							register={register("amountInput", {
								required: t("forms.validation.chainAmount.required"),
								validate: {
									greaterThanZero: (val) =>
										stringToNumber(val) > 0 ||
										t("forms.validation.chainAmount.required"),
								},
								onChange: amountChangeHandler,
							})}
							errorMessage={errors.amountInput}
						/>

						<div className="mt-2 flex flex-col justify-center">
							<Input
								className="w-full"
								classNames={{
									inputWrapper:
										"bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
								}}
								type="text"
								isInvalid={!!errors.commentInput}
								errorMessage={errors.commentInput?.message}
								{...register("commentInput", {
									onChange: commentChangeHandler,
								})}
								label={t("tx.comment")}
								value={comment}
								placeholder={t("tx.comment_placeholder")}
							/>
						</div>
					</div>
				</fieldset>

				{error && <Alert color="danger">{error}</Alert>}
			</ConfirmModal.Body>

			<ConfirmModal.Footer>
				<Button
					color="primary"
					type="submit"
					isDisabled={isLoading || (!isValid && submitCount > 0)}
					isLoading={isLoading}
				>
					{t("wallet.create_invoice")}
				</Button>
			</ConfirmModal.Footer>
		</form>
	);
};

export default ReceiveLN;
