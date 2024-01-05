import { FC, useEffect, useState } from "react";
import "moment/locale/es";
import moment from "moment";
import { FormikHelpers } from "formik";
import { Modal } from "../Atoms/Modal";
import { getCouponImage } from "@services";
import ReactCardFlip from "react-card-flip";
import { Switch } from "../FormInputs/Switch";
import { IconButton } from "@material-tailwind/react";
import { CouponForm, CouponFormValues } from "./CouponForm";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import defaultImage from "../../assets/images/default-coupon-image.png";
import {
  CouponDiscountType,
  CouponInterface,
  CouponType,
  ProductCategoryInterface,
  ProductInterface,
} from "@objects";

interface CouponCardProps {
  coupon: CouponInterface;
  products: ProductInterface[];
  categories: ProductCategoryInterface[];
  onDelete?: () => Promise<boolean>;
  onEdit?: (
    values: CouponFormValues,
    formik: FormikHelpers<CouponFormValues>
  ) => Promise<boolean>;
  onInlineEdit?: (coupon: CouponInterface) => void;
}
export const CouponCard: FC<CouponCardProps> = ({
  coupon,
  products,
  categories,
  onEdit = () => false,
  onDelete = () => false,
  onInlineEdit = () => false,
}) => {
  const [image, setImage] = useState<File>();
  const [isFlipped, setIsFlipped] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    getCouponImage(coupon.id).then((res) => {
      if (res.isError) return;

      setImage(res.data);
    });
  }, [coupon.id]);

  return (
    <div className="w-full md:w-auto">
      <div
        className="group cursor-pointer w-full md:w-auto"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          <div className="flex flex-col overflow-hidden rounded-lg w-full md:w-[23rem] h-[23rem] shadow-lg group-hover:shadow-2xl">
            <div className="relative h-1/2">
              {!!image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="product image"
                  className="w-full h-full object-cover"
                />
              )}

              {!image && (
                <img
                  src={defaultImage}
                  alt="Image not found"
                  className="w-full h-full object-cover opacity-[0.5]"
                />
              )}

              {/* Product actions */}
              <IconButton
                variant="text"
                title="Editar"
                data-te-toggle="tooltip"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenEditModal(true);
                }}
                className="!absolute p-2 top-2 right-2 bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-75"
              >
                <PencilIcon className="h-6 w-6 text-orange-700" />
              </IconButton>
            </div>

            {/* Product resume */}
            <div className="flex flex-col p-4 h-1/2">
              <div className="flex flex-1">
                <div className="flex flex-1 flex-col">
                  <p className="text-lg sm:text-xl font-bold text-gray-800">
                    {coupon.name}
                  </p>

                  {coupon.type === CouponType.CATEGORY && (
                    <p className="hidden sm:block text-gray-500 font-medium">
                      Aplicado a {coupon.categories.length} categoría
                      {coupon.categories.length > 1 && "s"}
                    </p>
                  )}

                  {coupon.type === CouponType.PRODUCT && (
                    <p className="hidden sm:block text-gray-500 font-medium">
                      Aplicado a {coupon.products.length} producto
                      {coupon.products.length > 1 && "s"}
                    </p>
                  )}
                </div>

                <div className="min-w-[5rem] text-right">
                  <p className="text-gray-800">Descuento</p>
                  <p className="text-xl font-bold text-orange-700">
                    -{coupon.discountType === CouponDiscountType.AMOUNT && "$"}
                    {coupon.value.toFixed(2)}
                    {coupon.discountType === CouponDiscountType.PERCENTAGE && "%"}
                  </p>
                </div>
              </div>

              <div className="flex w-full justify-between items-end">
                <div>
                  <p className="text-gray-500 text-sm">
                    <span>Desde: </span>
                    <br className="sm:hidden" />
                    <span className="text-gray-800">
                      {moment(coupon.startDate).format("DD [de] MMMM, YYYY")}
                    </span>
                  </p>

                  <p className="text-gray-500 text-sm">
                    <span>Hasta: </span>
                    <br className="sm:hidden" />
                    <span className="text-gray-800">
                      {moment(coupon.endDate).format("DD [de] MMMM, YYYY")}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-sm items-center">
                  Activo
                  <div onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={coupon.enabled}
                      onChange={() =>
                        onInlineEdit({
                          ...coupon,
                          enabled: !coupon.enabled,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col p-6 overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full rounded-lg w-full md:w-[23rem] h-[23rem] shadow-lg group-hover:shadow-2xl">
            <div className="flex justify-between gap-4">
              <p className="text-2xl font-bold text-gray-800">{coupon.name}</p>

              <p className="text-2xl text-orange-700 font-bold">
                -{coupon.discountType === CouponDiscountType.AMOUNT && "$"}
                {coupon.value.toFixed(2)}
                {coupon.discountType === CouponDiscountType.PERCENTAGE && "%"}
              </p>
            </div>

            <p className="text-gray-900 text-sm">
              Activo: <span className="font-medium">{coupon.enabled ? "Si" : "No"}</span>
            </p>
            <p className="text-gray-900 text-sm">
              Desde:{" "}
              <span className="ml-1 text-gray-800 font-medium">
                {moment(coupon.startDate).format("DD [de] MMMM, YYYY")}
              </span>
            </p>
            <p className="text-gray-900 text-sm">
              Hasta:{" "}
              <span className="ml-1 text-gray-800 font-medium">
                {moment(coupon.endDate).format("DD [de] MMMM, YYYY")}
              </span>
            </p>

            <p className="text-gray-800 text-sm mt-4">{coupon.description}</p>

            {coupon.type === CouponType.CATEGORY && (
              <div className="flex flex-col mt-4">
                <p className="text-md font-semibold">Aplicado a las categorías:</p>

                <ul className="px-4">
                  {coupon.categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((c) => (
                      <li key={c.id} className="text-sm truncate">
                        - {c.name}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {coupon.type === CouponType.PRODUCT && (
              <div className="flex flex-col mt-4">
                <p className="text-md font-semibold">Aplicado a los productos:</p>

                <ul className="px-4">
                  {coupon.products
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((p) => (
                      <li key={p.id} className="text-sm truncate">
                        - {p.name}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <IconButton
              variant="text"
              title="Destacar"
              data-te-toggle="tooltip"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteModal(true);
              }}
              className="!fixed p-2 bottom-2 right-4 bg-red-50 bg-opacity-50 hover:bg-red-100 hover:bg-opacity-75"
            >
              <TrashIcon className="h-6 w-6 text-orange-900" />
            </IconButton>
          </div>
        </ReactCardFlip>
      </div>

      <Modal
        className="w-full max-w-[55rem] m-8"
        open={openEditModal}
        setOpen={setOpenEditModal}
      >
        <p className="text-2xl font-light mb-4">
          Editar Cupón{" "}
          <span className="text-gray-800 font-medium italic">{coupon?.name}</span>
        </p>

        <CouponForm
          products={products}
          categories={categories}
          onSubmit={async (values, formik) => {
            const result = onEdit(values, formik);
            if (result) {
              setImage(values.image);
              setOpenEditModal(false);
            }
          }}
          onCancel={() => setOpenEditModal(false)}
          initialValues={{
            name: coupon.name,
            value: coupon.value.toString(),
            type: CouponType.PRODUCT,
            discountType: CouponDiscountType.PERCENTAGE,
            description: coupon.description,
            startDate: coupon.startDate,
            endDate: coupon.endDate,
            enabled: coupon.enabled,
            products: coupon.products,
            categories: coupon.categories,
            image,
          }}
        />
      </Modal>

      <Modal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <p className="text-xl font-light mb-4">Eliminar cupón</p>

        <p className="mb-4 text-center">
          ¿Estás seguro que deseas eliminar el cupón{" "}
          <span className="font-medium italic text-gray-800">{coupon.name}</span>?
        </p>

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenDeleteModal(false)}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton
            onClick={async () => {
              const result = await onDelete();
              if (result) setOpenDeleteModal(false);
            }}
            type="submit"
            className="w-full sm:w-40"
          >
            Eliminar
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
