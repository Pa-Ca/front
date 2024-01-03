import { FC } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FormText } from "../FormInputs/FormText";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { LinkText, PrimaryButton } from "../FormInputs/Buttons";

export interface LoginFormValues {
  email: string;
  password: string;
}
interface FormInterface {
  formik: FormikProps<LoginFormValues>;
}
const Form: FC<FormInterface> = ({ formik }) => {
  const navigate = useNavigate();

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

        <div>
          <FormText
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            label="Contraseña"
            value={formik.values.password}
            error={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : undefined
            }
            onChange={formik.handleChange}
          />
          <div className="w-full flex justify-end">
            <LinkText
              text="Olvidé mi contraseña"
              onClick={() => navigate("/password-recovery")}
              className="text-sm"
            />
          </div>
        </div>

        <div className="w-full mt-4">
          <PrimaryButton type="submit" className="w-full">
            Iniciar Sesión
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

interface LoginFormProps {
  onSubmit?: (prop: LoginFormValues, formik: FormikHelpers<LoginFormValues>) => void;
}
export const LoginForm: FC<LoginFormProps> = ({ onSubmit = () => {} }) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Este campo es requerido"),
    password: Yup.string().required("Este campo es requerido"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
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
