import { useContext } from "react";
import type { FC } from "react";
import { ReactComponent as CheckCircle } from "../../assets/check-circle.svg";
import { ReactComponent as DotsCircle } from "../../assets/dots-circle-horizontal.svg";
import { ReactComponent as XCircle } from "../../assets/x-circle.svg";
import { SSEContext } from "../../store/sse-context";

const ConnectStatus: FC = () => {
  const { evtSource } = useContext(SSEContext);
  if (!evtSource) {
    return <div></div>;
  }

  const { readyState } = evtSource;

  return (
    <div className="mx-10 flex h-8 w-8 items-center justify-center">
      {readyState === evtSource.OPEN && (
        <CheckCircle className="text-green-600" />
      )}
      {readyState === evtSource.CONNECTING && (
        <DotsCircle className="text-blue-600" />
      )}
      {readyState === evtSource.CLOSED && <XCircle className="text-red-600" />}
    </div>
  );
};

export default ConnectStatus;
