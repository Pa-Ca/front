export const handleIntegerChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  min?: number,
  max?: number
) => {
  if (event.target.value.length > 1) {
    event.target.value = event.target.value.replace(/^0+/, "");
  }
  event.target.value = event.target.value.replace(/[^0-9-]/g, "");
  if (event.target.value.charAt(0) !== "-" && event.target.value.includes("-")) {
    event.target.value = event.target.value.replace(/-/g, "");
  }

  // Check if the value is within the specified range
  const value = parseInt(event.target.value, 10);
  if (max !== undefined && value > max) {
    event.target.value = max.toString();
  }
  if (min !== undefined && value < min) {
    event.target.value = min.toString();
  }

  onChange(event);
};

export const handleNumberChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  min?: number,
  max?: number
) => {
  if (event.target.value.length > 1) {
    event.target.value = event.target.value.replace(/^0+/, "");
  }

  if (!/^[-]{0,1}\d*\.?\d*$/.test(event.target.value)) {
    return;
  }

  if (event.target.value.length > 1) {
    event.target.value = event.target.value.replace(/^0+/, "");
  }
  if (event.target.value === "") {
    event.target.value = "0";
  } else if (event.target.value[0] === ".") {
    event.target.value = "0" + event.target.value;
  }

  // Check if the value is within the specified range
  const value = Number(event.target.value);
  if (max !== undefined && value > max) {
    event.target.value = max.toString();
  }
  if (min !== undefined && value < min) {
    event.target.value = min.toString();
  }

  onChange(event);
};
