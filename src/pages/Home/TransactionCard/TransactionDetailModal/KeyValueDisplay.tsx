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
		<article className="m-2 flex overflow-hidden border-b-2 border-gray-400 py-1 text-left">
			<h6 className="w-1/2 text-gray-200">{name}</h6>
			<p className="mx-2 w-1/2 overflow-hidden overflow-x-auto">{value}</p>
		</article>
	);
};

export default KeyValueDisplay;
