import { FC, useContext } from "react";
import { ReactComponent as CheckCircle } from "../../assets/check-circle.svg";
import { ReactComponent as DotsCircle } from "../../assets/dots-circle-horizontal.svg";
import { ReactComponent as XCircle } from "../../assets/x-circle.svg";
import { SSEContext } from "../../store/sse-context";

const ConnectStatus: FC = () => {
  const { evtSource } = useContext(SSEContext);
  if (!evtSource) {
    return <div></div>;
  }
  return (
    <div className="mx-10 flex h-8 w-8 items-center justify-center">
      {evtSource.readyState === evtSource.OPEN && (
        <CheckCircle className="text-green-600" />
      )}
      {evtSource.readyState === evtSource.CONNECTING && (
        <DotsCircle className="text-blue-600" />
      )}
      {evtSource.readyState === evtSource.CLOSED && (
        <XCircle className="text-red-600" />
      )}
    </div>
  );
};

export default ConnectStatus;
