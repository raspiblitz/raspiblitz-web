import type { FC } from "react";

interface Props {
  name: string;
  value: string;
  label?: string;
}

const KeyValueCard: FC<Props> = ({ name, value, label }) => {
  return (
    <div className="rounded-lg bg-gray-800/50 px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h6 className="text-sm font-medium text-gray-400">{name}</h6>
        </div>
        <div className="flex-1 text-right">
          <p className="break-all text-sm text-gray-200">{value}</p>
          {label && <p className="text-xs text-gray-500">{label}</p>}
        </div>
      </div>
    </div>
  );
};

export default KeyValueCard;
