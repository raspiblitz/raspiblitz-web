import { Image } from "@nextui-org/image";
import { Radio, cn } from "@nextui-org/react";
import { ReactNode } from "react";

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

const imageBaseClasses = "mr-3 flex rounded-lg bg-white bg-opacity-5 p-2";

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
        labelWrapper: "m-0",
      }}
    >
      <div className={cn("flex flex-row pr-2", !description && "items-center")}>
        {!!image && (
          <div
            className={cn(
              "flex items-center",
              "h-16 w-16 shrink-0",
              imageBaseClasses,
            )}
          >
            <Image
              width={46}
              height={46}
              alt={`${text} image`}
              src={image}
              radius="none"
              className="max-w-10 max-h-auto"
            />
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
            <p className="mt-2 text-sm leading-6 text-secondary">
              {description}
            </p>
          )}
        </div>
      </div>
    </Radio>
  );
}
