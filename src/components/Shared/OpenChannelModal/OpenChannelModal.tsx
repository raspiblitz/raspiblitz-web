import type { FC } from "react";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import { AppContext } from "../../../store/app-context";
import { MODAL_ROOT } from "../../../util/util";

interface IFormInputs {
  amountInput: number;
  commentInput: string;
}

type Props = {
  onClose: () => void;
};

const OpenChannelModal: FC<Props> = ({ onClose }) => {
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  return createPortal(
    <ModalDialog close={onClose}>
      <h2>OPEN CHANNEL</h2>
      <article>
        <article>
          <label>Fee Rate</label>
          <select>
            <option>Urgent</option>
            <option>Normal</option>
            <option>Slow</option>
          </select>
        </article>
      </article>
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default OpenChannelModal;
