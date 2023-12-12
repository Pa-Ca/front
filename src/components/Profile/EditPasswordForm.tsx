import { FC } from "react";
import * as Yup from "yup";
import { FormText } from "../FormInputs/FormText";
import { PrimaryButton } from "../FormInputs/Buttons";
import { Formik, FormikHelpers, FormikProps } from "formik";

export interface EditPasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
interface FormInterface {
  formik: FormikProps<EditPasswordFormValues>;
}
const Form: FC<FormInterface> = ({ formik }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FormText
          id="oldPassword"
          name="oldPassword"
          type="password"
          autoComplete="current-password"
          label="Contraseña actual"
          value={formik.values.oldPassword}
          error={
            formik.touched.oldPassword && formik.errors.oldPassword
              ? formik.errors.oldPassword
              : undefined
          }
          onChange={formik.handleChange}
        />

        <FormText
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          label="Nueva contraseña"
          value={formik.values.newPassword}
          error={
            formik.touched.newPassword && formik.errors.newPassword
              ? formik.errors.newPassword
              : undefined
          }
          onChange={formik.handleChange}
        />

        <FormText
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          label="Confirmar nueva contraseña"
          value={formik.values.confirmNewPassword}
          error={
            formik.touched.confirmNewPassword && formik.errors.confirmNewPassword
              ? formik.errors.confirmNewPassword
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

interface EditPasswordFormProps {
  onSubmit?: (
    prop: EditPasswordFormValues,
    formik: FormikHelpers<EditPasswordFormValues>
  ) => void;
}
export const EditPasswordForm: FC<EditPasswordFormProps> = ({ onSubmit = () => {} }) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Este campo es requerido"),
    newPassword: Yup.string().required("Este campo es requerido"),
    confirmNewPassword: Yup.string()
      .required("Este campo es requerido")
      .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden"),
  });

  return (
    <Formik
      initialValues={{ oldPassword: "", newPassword: "", confirmNewPassword: "" }}
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
