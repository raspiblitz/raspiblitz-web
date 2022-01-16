import type { FC } from "react";

export type Props = {
  name: string;
  value: string;
};

/**
 * Used for the display of Transaction Details
 */
const KeyValueDisplay: FC<Props> = ({ name, value }) => {
  return (
    <article className="m-2 py-1 flex overflow-hidden border-gray-400 border-b-2 text-left">
      <h6 className="w-1/2 text-gray-500 dark:text-gray-200">{name}</h6>
      <p className="w-1/2 overflow-hidden overflow-x-auto mx-2">{value}</p>
    </article>
  );
};

export default KeyValueDisplay;
