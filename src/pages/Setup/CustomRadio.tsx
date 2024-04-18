import { Radio, cn } from "@nextui-org/react";
import { ReactNode } from "react";

type Props = {
  id: string;
  radioGroup: string;
  value: string;
  icon: ReactNode;
  iconColor?: string;
  text: string;
};

export default function CustomRadio({
  id,
  radioGroup,
  value,
  icon,
  text,
  iconColor,
}: Props) {
  return (
    <Radio
      id={id}
      radioGroup={radioGroup}
      value={value}
      className="remove-radio"
      classNames={{
        base: cn(
          "inline-flex m-0 bg-blue-900 hover:bg-primary-800 justify-between items-center",
          "flex-row-reverse max-w-[800px] cursor-pointer rounded-lg gap-4 border-2 border-white/5 pr-4",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      <div className="flex flex-row items-center pr-2">
        <div
          className={`my-1 mr-3 flex rounded-lg bg-white bg-opacity-5 p-2 ${iconColor ? iconColor : "text-white"}`}
        >
          {icon}
        </div>
        <p className="text-lg font-semibold">{text}</p>
      </div>
    </Radio>
  );
}
