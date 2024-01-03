import classNames from "classnames";
import {
  List,
  Checkbox,
  ListItem,
  Typography,
  ListItemPrefix,
} from "@material-tailwind/react";

interface Option<T> {
  value: T;
  id: string;
  label: string;
  checked: boolean;
}
interface MultiCheckBoxProps<T> {
  items: Option<T>[];
  disabled?: boolean;
  itemClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
  onChange: (values: Option<T>[]) => void;
}
export function FormMultiCheckBox<T>({
  items,
  disabled,
  itemClassName,
  labelClassName,
  containerClassName,
  onChange,
}: MultiCheckBoxProps<T>) {
  const handleChange = (item: Option<T>) => {
    const newItems = items.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          checked: !i.checked,
        };
      }

      return i;
    });

    onChange(newItems);
  };

  return (
    <List className={containerClassName}>
      {items.map((item) => (
        <ListItem
          key={item.id}
          ripple={false}
          disabled={disabled}
          className={classNames("p-0", itemClassName)}
        >
          <label
            htmlFor={item.id}
            className="flex w-full cursor-pointer items-center px-3 py-2"
          >
            <ListItemPrefix className="mr-3">
              <Checkbox
                crossOrigin=""
                id={item.id}
                ripple={false}
                checked={item.checked}
                color="orange"
                onChange={() => handleChange(item)}
                className="hover:before:opacity-0 hover:text-orange-700 focus:ring-orange-700 focus:text-orange-700"
                containerProps={{
                  className: "p-0",
                }}
              />
            </ListItemPrefix>

            <Typography color="blue-gray" className={labelClassName}>
              {item.label}
            </Typography>
          </label>
        </ListItem>
      ))}
    </List>
  );
}
