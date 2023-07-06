import { FC } from "react";

type Props = {
  color?: string;
  message: string;
};

const Message: FC<Props> = ({ message, color = "bg-red-500" }) => {
  return (
    <p className={`mt-5 break-words rounded ${color} px-5 py-1 text-white`}>
      {message}
    </p>
  );
};

export default Message;
