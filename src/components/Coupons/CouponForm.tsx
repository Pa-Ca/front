import { FC, useMemo } from "react";
import * as Yup from "yup";
import moment from "moment";
import classNames from "classnames";
import { Badge } from "../Atoms/Badge";
import { handleNumberChange } from "@utils";
import { Switch } from "../FormInputs/Switch";
import { FormText } from "../FormInputs/FormText";
import { FormFile } from "../FormInputs/FormFile";
import { FormSelect } from "../FormInputs/FormSelect";
import { FormSearch } from "../FormInputs/FormSearch";
import { FormTextArea } from "../FormInputs/FormTextArea";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { FormDatePicker } from "../FormInputs/FormDatePicker";
import { FormTextSelect } from "../FormInputs/FormTextSelect";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import {
  CouponType,
  ProductInterface,
  CouponDiscountType,
  ProductCategoryInterface,
} from "@objects";

const DISCOUNT_TYPES_OPTIONS = [
  {
    name: "%",
    value: CouponDiscountType.PERCENTAGE,
    id: CouponDiscountType.PERCENTAGE.toString(),
  },
  {
    name: "$",
    value: CouponDiscountType.AMOUNT,
    id: CouponDiscountType.AMOUNT.toString(),
  },
];
const COUPON_TYPES_OPTIONS = [
  {
    name: "Productos",
    value: CouponType.PRODUCT,
    id: CouponType.PRODUCT.toString(),
  },
  {
    name: "Categorías",
    value: CouponType.CATEGORY,
    id: CouponType.CATEGORY.toString(),
  },
];

export interface CouponFormValues {
  name: string;
  value: string;
  type: CouponType;
  discountType: CouponDiscountType;
  description: string;
  startDate: string;
  endDate: string;
  enabled: boolean;
  image: File | undefined;
  products: ProductInterface[];
  categories: ProductCategoryInterface[];
}
interface FormInterface {
  formik: FormikProps<CouponFormValues>;
  products: ProductInterface[];
  categories: ProductCategoryInterface[];
  onCancel?: () => void;
}
const Form: FC<FormInterface> = ({ formik, products, categories, onCancel }) => {
  const startDateData = useMemo(() => {
    const date = formik.values.startDate
      ? moment(formik.values.startDate).toDate()
      : null;
    return {
      startDate: date,
      endDate: date,
    };
  }, [formik.values.startDate]);

  const endDateData = useMemo(() => {
    const date = formik.values.endDate ? moment(formik.values.endDate).toDate() : null;
    return {
      startDate: date,
      endDate: date,
    };
  }, [formik.values.endDate]);

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

          <FormTextSelect
            required
            id="value"
            name="value"
            autoComplete="off"
            label="Descuento"
            value={formik.values.value}
            selected={{
              value: formik.values.discountType,
              name: formik.values.discountType === CouponDiscountType.AMOUNT ? "$" : "%",
              id: formik.values.discountType.toString(),
            }}
            error={
              formik.touched.value && formik.errors.value
                ? formik.errors.value
                : undefined
            }
            options={DISCOUNT_TYPES_OPTIONS}
            onChange={(e) => handleNumberChange(e, formik.handleChange, 0)}
            onSelectOption={(value) => formik.setFieldValue("discountType", value)}
            containerClassName="flex flex-1 flex-col"
            selectContainerClassNames="!w-14"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormDatePicker
            required
            label="Desde"
            id="startDate"
            name="startDate"
            useRange={false}
            maxDate={
              formik.values.endDate ? moment(formik.values.endDate).toDate() : undefined
            }
            error={
              formik.touched.startDate && formik.errors.startDate
                ? formik.errors.startDate
                : undefined
            }
            value={startDateData}
            placeholder="Elegir fecha"
            toggleClassName={(oldClassName) =>
              classNames(oldClassName, "text-orange-700")
            }
            onChange={(e) =>
              formik.setFieldValue(
                "startDate",
                e?.startDate ? moment(e?.startDate).toDate() : ""
              )
            }
            configs={{
              shortcuts: {
                today: "Hoy",
                yesterday: "Ayer",
                currentMonth: "Mes actual",
                pastMonth: "Mes anterior",
                past: (period: number) => `Hace ${period} días`,
              },
            }}
            containerClassName="flex-1"
          />

          <FormDatePicker
            required
            label="Hasta"
            id="endDate"
            name="endDate"
            useRange={false}
            minDate={
              formik.values.startDate
                ? moment(formik.values.startDate).toDate()
                : undefined
            }
            value={endDateData}
            placeholder="Elegir fecha"
            toggleClassName={(oldClassName) =>
              classNames(oldClassName, "text-orange-700")
            }
            onChange={(e) =>
              formik.setFieldValue(
                "endDate",
                e?.startDate ? moment(e?.startDate).toDate() : ""
              )
            }
            error={
              formik.touched.endDate && formik.errors.endDate
                ? formik.errors.endDate
                : undefined
            }
            configs={{
              shortcuts: {
                today: "Hoy",
                yesterday: "Ayer",
                currentMonth: "Mes actual",
                pastMonth: "Mes anterior",
                past: (period: number) => `Hace ${period} días`,
              },
            }}
            containerClassName="flex-1"
          />

          <div className="flex flex-col gap-1 text-sm items-center mt-4">
            Disponible
            <Switch
              checked={formik.values.enabled}
              onChange={(v) => formik.setFieldValue("enabled", v)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormSelect
            id="type"
            name="type"
            label="Aplicado a"
            selected={{
              value: formik.values.type,
              name:
                formik.values.type === CouponType.PRODUCT ? "Productos" : "Categorías",
              id: formik.values.type.toString(),
            }}
            options={COUPON_TYPES_OPTIONS}
            error={
              formik.touched.type && formik.errors.type ? formik.errors.type : undefined
            }
            onChange={(value) => {
              formik.setFieldValue("type", value);
              formik.setFieldValue("products", []);
              formik.setFieldValue("categories", []);
            }}
            containerClassName="flex flex-1 flex-col"
          />

          <FormSearch
            id="product"
            name="product"
            label="Seleccionar Productos"
            selected={{
              value: undefined,
              name: "",
              id: "",
            }}
            error={
              formik.touched.products && formik.errors.products
                ? formik.errors.products
                : undefined
            }
            placeholder="Buscar producto"
            options={products
              .filter(
                (product) => !formik.values.products.find((p) => p.id === product.id)
              )
              .map((product) => ({
                value: product,
                name: product.name,
                id: product.id.toString(),
              }))}
            onSelectOption={(product) =>
              formik.setFieldValue("products", [...formik.values.products, product])
            }
            containerClassName={classNames(
              "flex flex-[2] flex-col",
              formik.values.type === CouponType.CATEGORY && "hidden"
            )}
          />

          <FormSearch
            id="category"
            name="category"
            label="Seleccionar Categorías"
            selected={{
              value: undefined,
              name: "",
              id: "",
            }}
            error={
              formik.touched.categories && formik.errors.categories
                ? formik.errors.categories
                : undefined
            }
            placeholder="Buscar categoría"
            options={categories
              .filter(
                (category) => !formik.values.categories.find((c) => c.id === category.id)
              )
              .map((category) => ({
                value: category,
                name: category.name,
                id: category.id.toString(),
              }))}
            onSelectOption={(category) =>
              formik.setFieldValue("categories", [...formik.values.categories, category])
            }
            containerClassName={classNames(
              "flex flex-[2] flex-col",
              formik.values.type === CouponType.PRODUCT && "hidden"
            )}
          />

          <div className="flex flex-col justify-start mt-2 gap-1">
            <PrimaryButton
              type="button"
              className="!p-1 text-xs"
              onClick={() => {
                if (formik.values.type === CouponType.PRODUCT) {
                  formik.setFieldValue("products", products);
                } else {
                  formik.setFieldValue("categories", categories);
                }
              }}
            >
              Agregar todos
            </PrimaryButton>
            <SecondaryButton
              type="button"
              className="!p-1 text-xs"
              onClick={() => {
                formik.setFieldValue("products", []);
                formik.setFieldValue("categories", []);
              }}
            >
              Remover todos
            </SecondaryButton>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-2">
          {formik.values.products.map((product) => (
            <Badge
              key={product.id}
              name={product.name}
              onDelete={() => {
                const index = formik.values.products.findIndex(
                  (p) => p.id === product.id
                );
                const newProducts = [...formik.values.products];
                newProducts.splice(index, 1);
                formik.setFieldValue("products", newProducts);
              }}
            />
          ))}

          {formik.values.categories.map((category) => (
            <Badge
              key={category.id}
              name={category.name}
              onDelete={() => {
                const index = formik.values.categories.findIndex(
                  (c) => c.id === category.id
                );
                const newCategories = [...formik.values.categories];
                newCategories.splice(index, 1);
                formik.setFieldValue("categories", newCategories);
              }}
            />
          ))}
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

interface CouponFormProps {
  initialValues?: CouponFormValues;
  products: ProductInterface[];
  categories: ProductCategoryInterface[];
  onCancel?: () => void;
  onSubmit?: (prop: CouponFormValues, formik: FormikHelpers<CouponFormValues>) => void;
}
export const CouponForm: FC<CouponFormProps> = ({
  initialValues,
  products,
  categories,
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    value: Yup.number()
      .required("El descuento es requerido")
      .min(0, "El descuento debe ser mayor a 0"),
    startDate: Yup.date().required("La fecha inicial es requerida"),
    endDate: Yup.date()
      .required("La fecha final es requerida")
      .min(
        Yup.ref("startDate"),
        "La fecha final debe ser mayor o igual a la fecha inicial"
      ),
    image: Yup.mixed<File>()
      .test(
        "image",
        "El archivo debe ser una imagen",
        (value?: File) => !value || value?.type?.startsWith("image")
      )
      .test(
        "image",
        "El archivo debe pesar menos de 5MB",
        (value?: File) => !value || value?.size < 5 * 1024 * 1024
      ),
    products: Yup.array<ProductInterface>().when("type", {
      is: (type: CouponType) => type === CouponType.PRODUCT,
      then: () =>
        Yup.array<ProductInterface>().min(1, "Debe seleccionar al menos un producto"),
    }),
    categories: Yup.array<ProductCategoryInterface>().when("type", {
      is: (type: CouponType) => type === CouponType.CATEGORY,
      then: () =>
        Yup.array<ProductCategoryInterface>().min(
          1,
          "Debe seleccionar al menos una categoría"
        ),
    }),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          name: "",
          value: "",
          type: CouponType.PRODUCT,
          discountType: CouponDiscountType.PERCENTAGE,
          description: "",
          startDate: "",
          endDate: "",
          enabled: true,
          image: undefined,
          products: [] as ProductInterface[],
          categories: [] as ProductCategoryInterface[],
        }
      }
      validationSchema={validationSchema}
      onSubmit={(values, formik) => {
        onSubmit(values, formik);
      }}
    >
      {(formik) => (
        <Form
          onCancel={onCancel}
          formik={formik}
          products={products}
          categories={categories}
        />
      )}
    </Formik>
  );
};
