import { FC } from "react";
import classNames from "classnames";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  option1: string;
  option2: string;
}
export const Toggle: FC<ToggleProps> = ({ id, option1, option2, checked, ...props }) => {
  return (
    <label
      htmlFor={id}
      className="flex items-center rounded-md cursor-pointer text-gray-900"
    >
      <input
        {...props}
        id={id}
        checked={checked}
        type="checkbox"
        className="hidden peer"
      />
      <span
        className={classNames(
          "flex-1 text-center px-4 py-2 font-medium rounded-l-md",
          checked ? "bg-orange-700 text-white" : "bg-gray-300"
        )}
      >
        {option1}
      </span>
      <span
        className={classNames(
          "flex-1 text-center px-4 py-2 font-medium rounded-r-md",
          !checked ? "bg-orange-700 text-white" : "bg-gray-300"
        )}
      >
        {option2}
      </span>
    </label>
  );
};
