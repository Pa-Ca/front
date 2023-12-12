export const handleNaturalNumberChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: React.ChangeEventHandler<HTMLInputElement>
) => {
  if (event.target.value.length > 1) {
    event.target.value = event.target.value.replace(/^0+/, "");
  }
  event.target.value = event.target.value.replace(/[^0-9]/g, "");

  onChange(event);
};

export const handleNumberChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: React.ChangeEventHandler<HTMLInputElement>
) => {
  if (event.target.value.length > 1) {
    event.target.value = event.target.value.replace(/^0+/, "");
  }

  if (!/^\d*\.?\d*$/.test(event.target.value)) {
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

  onChange(event);
};
