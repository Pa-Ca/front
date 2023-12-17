import { FC } from "react";
import * as Yup from "yup";
import { FormText } from "../FormInputs/FormText";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";

export interface ProductCategoryFormValues {
  name: string;
}
interface FormInterface {
  formik: FormikProps<ProductCategoryFormValues>;
  onCancel?: () => void;
}
const Form: FC<FormInterface> = ({ formik, onCancel }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FormText
          required
          id="name"
          name="name"
          autoComplete="off"
          label="Nombre"
          value={formik.values.name}
          error={
            formik.touched.name && formik.errors.name ? formik.errors.name : undefined
          }
          onChange={formik.handleChange}
        />

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

interface ProductCategoryFormProps {
  initialValues?: ProductCategoryFormValues;
  onCancel?: () => void;
  onSubmit?: (
    prop: ProductCategoryFormValues,
    formik: FormikHelpers<ProductCategoryFormValues>
  ) => void;
}
export const ProductCategoryForm: FC<ProductCategoryFormProps> = ({
  initialValues,
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Este campo es requerido"),
  });

  return (
    <Formik
      initialValues={initialValues || { name: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, formik) => {
        onSubmit(values, formik);
        formik.resetForm();
      }}
    >
      {(formik) => <Form onCancel={onCancel} formik={formik} />}
    </Formik>
  );
};
