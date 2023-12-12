import { FC } from "react";
import * as Yup from "yup";
import { handleNumberChange } from "@utils";
import { FormText } from "../FormInputs/FormText";
import { FormSelect } from "../FormInputs/FormSelect";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";

const TYPES = ["Porcentaje", "Cantidad"];

export interface TaxFormValues {
  name: string;
  type: string;
  value: string;
}
interface FormInterface {
  onCancel?: () => void;
  formik: FormikProps<TaxFormValues>;
}
const Form: FC<FormInterface> = ({ onCancel = () => {}, formik }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormText
            id="name"
            name="name"
            autoComplete="off"
            label="Nombre"
            value={formik.values.name}
            error={
              formik.touched.name && formik.errors.name ? formik.errors.name : undefined
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            containerClassName="flex-1"
          />

          <FormSelect
            id="type"
            name="type"
            label="Tipo"
            selected={{
              value: formik.values.type,
              name: formik.values.type,
              id: formik.values.type,
            }}
            options={TYPES.map((t) => ({ value: t, name: t, id: t }))}
            onChange={(value) => formik.setFieldValue("type", value)}
            containerClassName="flex-1"
          />

          <FormText
            id="value"
            name="value"
            autoComplete="off"
            label={`Valor ${formik.values.type === "Porcentaje" ? "(%)" : "($)"}`}
            value={formik.values.value}
            error={
              formik.touched.value && formik.errors.value
                ? formik.errors.value
                : undefined
            }
            onBlur={formik.handleBlur}
            onChange={(e) => handleNumberChange(e, formik.handleChange)}
            containerClassName="flex-1"
          />
        </div>

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

interface TaxFormProps {
  initialValues?: TaxFormValues;
  onCancel?: () => void;
  onSubmit?: (prop: TaxFormValues, formik: FormikHelpers<TaxFormValues>) => void;
}
export const TaxForm: FC<TaxFormProps> = ({
  initialValues,
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo requerido"),
    type: Yup.string().required("Campo requerido"),
    value: Yup.string().required("Campo requerido"),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          name: "",
          type: "Porcentaje",
          value: "",
        }
      }
      validationSchema={validationSchema}
      onSubmit={(values, formik) => onSubmit(values, formik)}
    >
      {(formik) => <Form onCancel={onCancel} formik={formik} />}
    </Formik>
  );
};
