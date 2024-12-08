import { XMarkIcon } from "@heroicons/react/24/outline";
import { type FC, type PropsWithChildren, useCallback, useEffect } from "react";
import ModalBackground from "./ModalBackground";

export const disableScroll = {
	on: () => document.body.classList.add("overflow-y-hidden"),
	off: () => document.body.classList.remove("overflow-y-hidden"),
};

type Props = {
	closeable?: boolean;
	close: () => void;
};

const ModalDialog: FC<PropsWithChildren<Props>> = ({
	closeable = true,
	close,
	children,
}) => {
	const closeModal = useCallback(() => {
		close();
		disableScroll.off();
	}, [close]);

	// close Modal on Esc
	const closeOnEsc = useCallback(
		(event: KeyboardEvent) => {
			if (closeable && event.key === "Escape") {
				closeModal();
			}
		},
		[closeModal, closeable],
	);

	useEffect(() => {
		disableScroll.on();
		window.addEventListener("keydown", closeOnEsc);
		return () => {
			window.removeEventListener("keydown", closeOnEsc);
			disableScroll.off();
		};
	}, [closeOnEsc]);

	return (
		<ModalBackground>
			<div className="flex h-screen max-h-full w-screen flex-col overflow-y-auto rounded-lg bg-gray-800 pb-8 text-center text-white shadow-xl md:h-auto md:w-4/5 lg:w-1/2 xl:mx-5 xl:w-2/5 xl:max-w-screen-sm">
				<div className="flex pr-2 pt-1">
					<button
						type="button"
						onClick={closeModal}
						className={`ml-auto mt-1 flex h-7 w-7 items-end ${
							closeable ? "" : "invisible"
						}`}
					>
						<XMarkIcon className="h-full w-full" />
					</button>
				</div>
				<div className="flex h-full flex-col justify-center px-5">
					{children}
				</div>
			</div>
		</ModalBackground>
	);
};

export default ModalDialog;
