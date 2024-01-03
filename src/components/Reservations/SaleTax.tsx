import { FC, useContext, useState } from "react";
import { useFetch } from "@hooks";
import { Modal } from "../Atoms/Modal";
import { FormikHelpers } from "formik";
import { TaxInterface } from "@objects";
import { Popover } from "../Atoms/Popover";
import { ReservationsContext } from "@utils";
import { TaxForm, TaxFormValues } from "../Profile/TaxForm";
import { alertService, deleteSaleTax, updateSaleTax } from "@services";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  List,
  ListItem,
  Typography,
  IconButton,
  ListItemSuffix,
} from "@material-tailwind/react";

interface SaleTaxProps {
  saleId: number;
  subTotal: number;
  tax: TaxInterface;
}
export const SaleTax: FC<SaleTaxProps> = ({ saleId, tax, subTotal }) => {
  const fetch = useFetch();
  const { setSales } = useContext(ReservationsContext);

  const [openEdit, setOpenEdit] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  const handleUpdate = async (
    values: TaxFormValues,
    formik: FormikHelpers<TaxFormValues>
  ) => {
    const dto = {
      id: tax.id,
      name: values.name,
      value: +values.value,
      isPercentage: values.type === "Porcentaje",
    };
    return await fetch((token: string) => updateSaleTax(dto, token)).then((response) => {
      if (response.isError) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      setSales((prev) => {
        const saleIndex = prev.findIndex((s) => s.sale.id === saleId);
        const newSales = [...prev];
        const taxIndex = newSales[saleIndex].taxes.findIndex((t) => t.id === dto.id);
        const newTaxes = [...newSales[saleIndex].taxes];
        newTaxes[taxIndex] = dto;
        newSales[saleIndex].taxes = newTaxes;

        return newSales;
      });
      setOpenEdit(false);
    });
  };

  const handleDelete = async () => {
    return await fetch((token: string) => deleteSaleTax(tax.id, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al eliminar el producto de la venta",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        setSales((prev) => {
          const saleIndex = prev.findIndex((s) => s.sale.id === saleId);
          const newSales = [...prev];
          newSales[saleIndex].taxes = newSales[saleIndex].taxes.filter(
            (t) => t.id !== tax.id
          );

          return newSales;
        });
      }
    );
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <Popover
          open={openPopover}
          setOpen={setOpenPopover}
          handler={
            <IconButton size="sm" variant="outlined" className="border-0">
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-800" />
            </IconButton>
          }
          containerClassname="p-1"
        >
          <List className="min-w-0 py-1">
            <ListItem
              className="p-0 bg-white w-auto hover:bg-gray-50"
              onClick={() => setOpenEdit(true)}
            >
              <div className="flex w-full justify-between gap-4 cursor-pointer items-center px-3 py-1 bg-white hover:bg-gray-100">
                <Typography color="blue-gray" className="text-sm">
                  Editar
                </Typography>

                <ListItemSuffix>
                  <PencilIcon className="w-4 h-4 text-gray-800" />
                </ListItemSuffix>
              </div>
            </ListItem>

            <hr />

            <ListItem
              className="p-0 bg-white w-auto hover:bg-gray-50"
              onClick={handleDelete}
            >
              <div className="flex w-full justify-between gap-4 cursor-pointer items-center px-3 py-1 bg-white hover:bg-gray-100">
                <Typography color="blue-gray" className="text-sm">
                  Eliminar
                </Typography>

                <ListItemSuffix>
                  <TrashIcon className="w-4 h-4 text-gray-800" />
                </ListItemSuffix>
              </div>
            </ListItem>
          </List>
        </Popover>

        <p className="font-light">
          {tax.name} {tax.isPercentage ? `(${tax.value}%)` : ""}
        </p>
      </div>

      <p className="font-light">
        {tax.isPercentage
          ? `$${(subTotal * (tax.value / 100)).toFixed(2)}`
          : `$${tax.value.toFixed(2)}`}
      </p>

      <Modal open={openEdit} setOpen={setOpenEdit} className="w-full m-8 max-w-[30rem]">
        <p className="text-2xl font-light mb-4">Editar Tarifa</p>

        <TaxForm
          initialValues={{
            name: tax.name,
            type: tax.isPercentage ? "Porcentaje" : "Fijo",
            value: tax.value.toString(),
          }}
          onSubmit={handleUpdate}
          onCancel={() => setOpenEdit(false)}
        />
      </Modal>
    </div>
  );
};
