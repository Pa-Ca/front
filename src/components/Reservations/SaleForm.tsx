import { FC } from "react";
import * as Yup from "yup";
import { Badge } from "../Atoms/Badge";
import { TableInterace } from "@objects";
import { handleIntegerChange } from "@utils";
import { FormText } from "../FormInputs/FormText";
import { FormSearch } from "../FormInputs/FormSearch";
import { FormTextArea } from "../FormInputs/FormTextArea";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";

export interface SaleFormValues {
  guestName: string;
  guestSurname: string;
  guestEmail: string;
  guestPhoneNumber: string;
  guestIdentityDocument: string;
  clientQuantity: string;
  tables: TableInterace[];
  note: string;
}
interface FormInterface {
  tables: TableInterace[];
  formik: FormikProps<SaleFormValues>;
  onCancel?: () => void;
}
const Form: FC<FormInterface> = ({ tables, formik, onCancel }) => {
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-6"
      autoComplete="nope"
    >
      <div className="flex flex-col gap-4">
        <hr />
        <p className="text-xl font-light">Datos del Cliente</p>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
          <FormText
            required
            id="guestName"
            name="guestName"
            autoComplete="nope"
            label="Nombre"
            value={formik.values.guestName}
            error={
              formik.touched.guestName && formik.errors.guestName
                ? formik.errors.guestName
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-1 flex-col"
          />

          <FormText
            required
            id="guestSurname"
            name="guestSurname"
            autoComplete="nope"
            label="Apellido"
            value={formik.values.guestSurname}
            error={
              formik.touched.guestSurname && formik.errors.guestSurname
                ? formik.errors.guestSurname
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-1 flex-col"
          />

          <FormText
            required
            type="email"
            id="guestEmail"
            name="guestEmail"
            autoComplete="nope"
            label="Correo electrónico"
            value={formik.values.guestEmail}
            error={
              formik.touched.guestEmail && formik.errors.guestEmail
                ? formik.errors.guestEmail
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-1 flex-col"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
          <FormText
            required
            id="guestPhoneNumber"
            name="guestPhoneNumber"
            autoComplete="nope"
            label="Número de teléfono"
            value={formik.values.guestPhoneNumber}
            error={
              formik.touched.guestPhoneNumber && formik.errors.guestPhoneNumber
                ? formik.errors.guestPhoneNumber
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-1 flex-col"
          />

          <FormText
            required
            id="guestIdentityDocument"
            name="guestIdentityDocument"
            autoComplete="nope"
            label="Cédula"
            value={formik.values.guestIdentityDocument}
            error={
              formik.touched.guestIdentityDocument && formik.errors.guestIdentityDocument
                ? formik.errors.guestIdentityDocument
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-1 flex-col"
          />

          <FormText
            required
            id="clientQuantity"
            name="clientQuantity"
            autoComplete="nope"
            label="Cantidad de clientes"
            value={formik.values.clientQuantity}
            error={
              formik.touched.clientQuantity && formik.errors.clientQuantity
                ? formik.errors.clientQuantity
                : undefined
            }
            onChange={(e) => handleIntegerChange(e, formik.handleChange, 0)}
            containerClassName="flex flex-1 flex-col"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:gap-4">
          <FormSearch
            id="tables"
            name="tables"
            label="Seleccionar Mesas"
            selected={{
              value: undefined,
              name: "",
              id: "",
            }}
            error={
              formik.touched.tables && formik.errors.tables
                ? formik.errors.tables
                : undefined
            }
            placeholder="Buscar mesa"
            options={tables
              .filter((table) => !formik.values.tables.find((t) => t.id === table.id))
              .map((table) => ({
                value: table,
                name: table.name,
                id: table.id.toString(),
              }))}
            onSelectOption={(table) =>
              formik.setFieldValue("tables", [...formik.values.tables, table])
            }
            containerClassName="flex flex-1 flex-col w-full"
          />

          <div className="flex items-center gap-4 mt-6 justify-between w-full sm:w-auto">
            <PrimaryButton
              type="button"
              onClick={() => formik.setFieldValue("tables", tables)}
            >
              Agregar todos
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() => formik.setFieldValue("tables", [])}
            >
              Remover todos
            </SecondaryButton>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-2">
          {formik.values.tables.map((table) => (
            <Badge
              key={table.id}
              name={table.name}
              onDelete={() => {
                const index = formik.values.tables.findIndex((p) => p.id === table.id);
                const newProducts = [...formik.values.tables];
                newProducts.splice(index, 1);
                formik.setFieldValue("tables", newProducts);
              }}
            />
          ))}
        </div>

        <FormTextArea
          id="note"
          name="note"
          rows={4}
          autoComplete="nope"
          label="Nota"
          value={formik.values.note}
          error={
            formik.touched.note && formik.errors.note ? formik.errors.note : undefined
          }
          onChange={formik.handleChange}
          className="h-32 resize-none"
        />

        <hr />

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton type="button" className="w-full sm:w-40" onClick={onCancel}>
            Cancelar
          </SecondaryButton>

          <PrimaryButton type="submit" className="w-full sm:w-40">
            Aceptar
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

interface SaleFormProps {
  tables: TableInterace[];
  onCancel?: () => void;
  onSubmit?: (prop: SaleFormValues, formik: FormikHelpers<SaleFormValues>) => void;
}
export const SaleForm: FC<SaleFormProps> = ({
  tables,
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    guestName: Yup.string().required("Este campo es obligatorio"),
    guestSurname: Yup.string().required("Este campo es obligatorio"),
    guestEmail: Yup.string()
      .email("El correo electrónico no es válido")
      .required("Este campo es obligatorio"),
    guestPhoneNumber: Yup.string().required("Este campo es obligatorio"),
    guestIdentityDocument: Yup.string().required("Este campo es obligatorio"),
    clientQuantity: Yup.string().required("Este campo es obligatorio"),
  });

  return (
    <Formik
      initialValues={{
        guestName: "",
        guestSurname: "",
        guestEmail: "",
        guestPhoneNumber: "",
        guestIdentityDocument: "",
        clientQuantity: "",
        tables: [] as TableInterace[],
        note: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, formik) => {
        onSubmit(values, formik);
      }}
    >
      {(formik) => <Form onCancel={onCancel} formik={formik} tables={tables} />}
    </Formik>
  );
};
