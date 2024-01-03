import { FC } from "react";
import * as Yup from "yup";
import { FormText } from "../FormInputs/FormText";
import { PrimaryButton } from "../FormInputs/Buttons";
import { Formik, FormikHelpers, FormikProps } from "formik";

export interface PasswordRecoveryFormValues {
  email: string;
}
interface FormInterface {
  formik: FormikProps<PasswordRecoveryFormValues>;
}
const Form: FC<FormInterface> = ({ formik }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FormText
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label="Correo"
          value={formik.values.email}
          error={
            formik.touched.email && formik.errors.email ? formik.errors.email : undefined
          }
          onChange={formik.handleChange}
        />

        <div className="w-full mt-8">
          <PrimaryButton type="submit" className="w-full">
            Recuperar Contraseña
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

interface PasswordRecoveryFormProps {
  onSubmit?: (
    prop: PasswordRecoveryFormValues,
    formik: FormikHelpers<PasswordRecoveryFormValues>
  ) => void;
}
export const PasswordRecoveryForm: FC<PasswordRecoveryFormProps> = ({
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Este campo es requerido"),
  });

  return (
    <Formik
      initialValues={{ email: "" }}
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
