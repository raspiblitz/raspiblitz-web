import { FC } from "react";

type Props = {
  errorMessage: string;
};

const ErrorMessage: FC<Props> = ({ errorMessage }) => {
  return <p className="break-all px-5 py-5 text-red-500">{errorMessage}</p>;
};

export default ErrorMessage;
