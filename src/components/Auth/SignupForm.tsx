import { FC } from "react";
import * as Yup from "yup";
import { Formik, FormikProps } from "formik";
import { FormText } from "../FormInputs/FormText";
import { LinkText, PrimaryButton } from "../FormInputs/Buttons";
import { FormCheckbox } from "@components";

export interface SignupFormValues {
  name: string;
  email: string;
  terms: boolean;
  password: string;
  confirmPassword: string;
}
interface FormInterface {
  formik: FormikProps<SignupFormValues>;
}
const Form: FC<FormInterface> = ({ formik }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 w-full">
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
            containerClassname="flex-1"
          />

          <FormText
            id="email"
            name="email"
            autoComplete="email"
            label="Correo"
            value={formik.values.email}
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : undefined
            }
            onChange={formik.handleChange}
            containerClassname="flex-1"
          />
        </div>

        <FormText
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          label="Contraseña"
          value={formik.values.password}
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : undefined
          }
          onChange={formik.handleChange}
        />

        <FormText
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          label="Confirmar Contraseña"
          value={formik.values.confirmPassword}
          error={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
          onChange={formik.handleChange}
        />

        <div>
          <div className="flex gap-2 items-center">
            <FormCheckbox
              id="terms"
              name="terms"
              onChange={formik.handleChange}
              checked={formik.values.terms}
            />

            <p className="text-sm items-center">
              Acepto los <LinkText text="Términos y Condiciones" />
            </p>
          </div>

          {formik.touched.terms && formik.errors.terms && (
            <span className="text-sm text-red-500 text-start">{formik.errors.terms}</span>
          )}
        </div>

        <div className="w-full mt-4">
          <PrimaryButton type="submit" className="w-full">
            Crear Cuenta
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

interface SignupFormProps {
  onSubmit?: (prop: SignupFormValues) => void;
}
export const SignupForm: FC<SignupFormProps> = ({ onSubmit = () => {} }) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Este campo es requerido"),
    email: Yup.string().required("Este campo es requerido"),
    password: Yup.string().required("Este campo es requerido"),
    confirmPassword: Yup.string().required("Este campo es requerido"),
    terms: Yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones"),
  });

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        terms: false,
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      {(formik) => <Form formik={formik} />}
    </Formik>
  );
};
