import { FC } from "react";
import classNames from "classnames";
import {
  PopoverHandler,
  PopoverContent,
  Popover as MUPopover,
} from "@material-tailwind/react";

interface PopoverProps {
  open: boolean;
  handler: React.ReactNode;
  children: React.ReactNode;
  containerClassname?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Popover: FC<PopoverProps> = ({
  open,
  handler,
  children,
  containerClassname,
  setOpen,
}) => {
  return (
    <MUPopover open={open} handler={setOpen} placement="bottom-end">
      <PopoverHandler>{handler}</PopoverHandler>
      <PopoverContent className={classNames("absolute", containerClassname)}>
        {children}
      </PopoverContent>
    </MUPopover>
  );
};
