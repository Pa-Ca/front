import { FC } from "react";
import * as Yup from "yup";
import { FormText } from "../FormInputs/FormText";
import { PrimaryButton } from "../FormInputs/Buttons";
import { Formik, FormikHelpers, FormikProps } from "formik";

export interface EditAccountFormValues {
  name: string;
  phoneNumber?: string;
}
interface FormInterface {
  formik: FormikProps<EditAccountFormValues>;
}
const Form: FC<FormInterface> = ({ formik }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FormText
          id="name"
          name="name"
          autoComplete="name"
          label="Nombre"
          value={formik.values.name}
          error={
            formik.touched.name && formik.errors.name ? formik.errors.name : undefined
          }
          onChange={formik.handleChange}
        />

        <FormText
          id="phoneNumber"
          name="phoneNumber"
          autoComplete="off"
          label="Celular"
          value={formik.values.phoneNumber}
          error={
            formik.touched.phoneNumber && formik.errors.phoneNumber
              ? formik.errors.phoneNumber
              : undefined
          }
          onChange={formik.handleChange}
        />

        <div className="w-full mt-4">
          <PrimaryButton type="submit" className="w-full">
            Aceptar
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

interface EditAccountFormProps {
  initialValues: EditAccountFormValues;
  onSubmit?: (
    prop: EditAccountFormValues,
    formik: FormikHelpers<EditAccountFormValues>
  ) => void;
}
export const EditAccountForm: FC<EditAccountFormProps> = ({
  initialValues,
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Este campo es requerido"),
    phoneNumber: Yup.string().required("Este campo es requerido"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, formik) => {
        onSubmit(values, formik);
        formik.resetForm();
      }}
    >
      {(formik) => <Form formik={formik} />}
    </Formik>
  );
};
