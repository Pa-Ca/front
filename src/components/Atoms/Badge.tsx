import { FC } from "react";

interface BagdeProps {
  name: string;
  onDelete?: () => void;
}
export const Badge: FC<BagdeProps> = ({ name, onDelete }) => {
  return (
    <span
      onClick={onDelete}
      className="inline-flex cursor-pointer items-center gap-x-0.5 rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10"
    >
      {name}

      <div className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-orange-600/20">
        <span className="sr-only">Remove</span>
        <svg
          viewBox="0 0 14 14"
          className="h-3.5 w-3.5 stroke-orange-600/50 group-hover:stroke-orange-600/75"
        >
          <path d="M4 4l6 6m0-6l-6 6" />
        </svg>
        <span className="absolute -inset-1" />
      </div>
    </span>
  );
};
