import { Radio, cn } from "@nextui-org/react";
import { ReactNode } from "react";
import { Image } from "@nextui-org/image";
type Props = {
  id: string;
  radioGroup: string;
  value: string;
  icon?: ReactNode;
  iconColor?: string;
  image?: string;
  text: string;
  description?: string;
};

const imageBaseClasses = "my-1 mr-3 flex rounded-lg bg-white bg-opacity-5 p-2";

export default function CustomRadio({
  id,
  radioGroup,
  value,
  icon,
  image,
  text,
  description,
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
      <div className={cn("flex flex-row pr-2", !description && "items-center")}>
        {!!image && (
          <div
            className={cn(
              "items-center",
              "h-16 w-16 shrink-0",
              imageBaseClasses,
            )}
          >
            <Image width={64} height={64} alt={`${text} image`} src={image} />
          </div>
        )}

        {!!icon && (
          <div
            className={cn(
              imageBaseClasses,
              iconColor ? iconColor : "text-white",
            )}
          >
            {icon}
          </div>
        )}

        <div>
          <p className="text-xl font-semibold">{text}</p>
          {!!description && (
            <p className="mt-2 text-sm text-secondary">{description}</p>
          )}
        </div>
      </div>
    </Radio>
  );
}
