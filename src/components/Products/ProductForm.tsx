import { FC } from "react";
import * as Yup from "yup";
import { handleNumberChange } from "@utils";
import { Switch } from "../FormInputs/Switch";
import { FormText } from "../FormInputs/FormText";
import { ProductCategoryInterface } from "@objects";
import { FormSearch } from "../FormInputs/FormSearch";
import { FormTextArea } from "../FormInputs/FormTextArea";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import { FormFile } from "../FormInputs/FormFile";

export interface ProductFormValues {
  name: string;
  price: string;
  description: string;
  disabled: boolean;
  highlight: boolean;
  deliveryDisabled: boolean;
  image: File | undefined;
  category: ProductCategoryInterface;
}
interface FormInterface {
  formik: FormikProps<ProductFormValues>;
  categories: ProductCategoryInterface[];
  onCancel?: () => void;
}
const Form: FC<FormInterface> = ({ formik, categories, onCancel }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
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
            containerClassName="flex flex-[2] flex-col"
          />

          <FormSearch
            required
            id="category"
            name="category"
            label="Categoría"
            selected={{
              value: formik.values.category,
              name: formik.values.category?.name ?? "",
              id: formik.values.category?.id.toString() ?? "",
            }}
            error={
              formik.touched.category && formik.errors.category
                ? formik.errors.category
                : undefined
            }
            options={categories.map((category) => ({
              value: category,
              name: category.name,
              id: category.id.toString(),
            }))}
            onSelectOption={(value) => formik.setFieldValue("category", value)}
            containerClassName="flex flex-[2] flex-col"
          />

          <FormText
            required
            id="price"
            name="price"
            autoComplete="off"
            label="Precio ($)"
            value={formik.values.price}
            error={
              formik.touched.price && formik.errors.price
                ? formik.errors.price
                : undefined
            }
            onChange={(e) => handleNumberChange(e, formik.handleChange)}
            containerClassName="flex flex-1 flex-col"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormTextArea
            id="description"
            name="description"
            label="Descripción"
            value={formik.values.description}
            onChange={formik.handleChange}
            containerClassName="flex-1"
            className="h-32 resize-none"
          />

          <div className="flex flex-row sm:flex-col px-2 gap-4 items-center justify-between sm:justify-center">
            <div className="flex flex-col gap-1 text-sm items-center">
              Destacado
              <Switch
                checked={formik.values.highlight}
                onChange={(v) => formik.setFieldValue("highlight", v)}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm items-center">
              Disponible
              <Switch
                checked={!formik.values.disabled}
                onChange={(v) => formik.setFieldValue("disabled", !v)}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm items-center">
              Con Delivery
              <Switch
                checked={!formik.values.deliveryDisabled}
                onChange={(v) => formik.setFieldValue("deliveryDisabled", !v)}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <FormFile
            id="image"
            name="image"
            selected={formik.values.image}
            error={
              formik.touched.image && formik.errors.image
                ? formik.errors.image
                : undefined
            }
            label="Seleccione la imagen del producto."
            description="Archivos admitidos: .jpg, .jpeg, .png, .gif, .svg. Tamaño máximo: 5MB."
            onSelectFile={(file) => formik.setFieldValue("image", file)}
            containerClassname="max-w-[25rem]"
            labelContainerClassname="h-[15rem]"
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

interface ProductFormProps {
  initialValues?: ProductFormValues;
  categories: ProductCategoryInterface[];
  onCancel?: () => void;
  onSubmit?: (prop: ProductFormValues, formik: FormikHelpers<ProductFormValues>) => void;
}
export const ProductForm: FC<ProductFormProps> = ({
  initialValues,
  categories,
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Este campo es requerido"),
    price: Yup.number().required("Este campo es requerido"),
    category: Yup.object().test(
      "category",
      "Este campo es requerido",
      (value: any) => value?.id !== -1
    ),
    image: Yup.mixed()
      .test(
        "image",
        "El archivo debe ser una imagen",
        (value: any) => !value || value?.type?.startsWith("image")
      )
      .test(
        "image",
        "El archivo debe pesar menos de 5MB",
        (value: any) => !value || value?.size < 5 * 1024 * 1024
      ),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          name: "",
          price: "",
          description: "",
          disabled: false,
          highlight: false,
          deliveryDisabled: false,
          image: undefined,
          category: {
            id: -1,
            branchId: -1,
            name: "",
          },
        }
      }
      validationSchema={validationSchema}
      onSubmit={(values, formik) => {
        onSubmit(values, formik);
      }}
    >
      {(formik) => <Form onCancel={onCancel} formik={formik} categories={categories} />}
    </Formik>
  );
};
