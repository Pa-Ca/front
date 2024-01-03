import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { Modal } from "../Atoms/Modal";
import { FormikHelpers } from "formik";
import { getProductImage } from "@services";
import ReactCardFlip from "react-card-flip";
import { Switch } from "../FormInputs/Switch";
import { StarIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { ProductForm, ProductFormValues } from "./ProductForm";
import { ProductCategoryInterface, ProductInterface } from "@objects";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import defaultImage from "../../assets/images/default-product-image.png";
import {
  TrashIcon,
  PencilIcon,
  StarIcon as OutlineStarIcon,
} from "@heroicons/react/24/outline";

interface ProductCardProps {
  product: ProductInterface;
  category?: ProductCategoryInterface;
  categories: ProductCategoryInterface[];
  onDelete?: () => Promise<boolean>;
  onEdit?: (
    values: ProductFormValues,
    formik: FormikHelpers<ProductFormValues>
  ) => Promise<boolean>;
  onInlineEdit?: (product: ProductInterface) => void;
}
export const ProductCard: FC<ProductCardProps> = ({
  product,
  category,
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
    getProductImage(product.id).then((res) => {
      if (res.isError) return;

      setImage(res.data);
    });
  }, [product.id]);

  return (
    <div className="w-full md:w-auto">
      <div
        className="group cursor-pointer w-full md:w-auto"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          <div className="flex flex-col overflow-hidden rounded-lg w-full md:w-[20rem] h-[20rem] shadow-lg group-hover:shadow-2xl">
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
                  className="w-full h-full object-cover opacity-[0.6]"
                />
              )}

              {/* Product actions */}
              <IconButton
                variant="text"
                title="Destacar"
                data-te-toggle="tooltip"
                onClick={(e) => {
                  e.stopPropagation();
                  onInlineEdit({
                    ...product,
                    highlight: !product.highlight,
                  });
                }}
                className={classNames(
                  "!absolute p-2 top-2 left-2 bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-75",
                  product.highlight && "border-2 border-orange-700"
                )}
              >
                {product.highlight && <StarIcon className="h-6 w-6 text-orange-700" />}

                {!product.highlight && (
                  <OutlineStarIcon className="h-6 w-6 text-orange-700" />
                )}
              </IconButton>

              <IconButton
                variant="text"
                title="Editar"
                data-te-toggle="tooltip"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
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
                  <p className="text-xl font-bold text-gray-800">{product.name}</p>
                  <p className="text-gray-500 font-medium">{category?.name}</p>
                </div>

                <div className="min-w-[5rem] text-right">
                  <p className="text-gray-800">Precio</p>
                  <p className="text-xl font-bold text-orange-700">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex w-full justify-evenly">
                <div className="flex flex-col gap-1 text-sm items-center">
                  Disponible
                  <div onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={!product.disabled}
                      onChange={() =>
                        onInlineEdit({
                          ...product,
                          disabled: !product.disabled,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-sm items-center">
                  Con Delivery
                  <div onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={!product.deliveryDisabled}
                      onChange={() =>
                        onInlineEdit({
                          ...product,
                          deliveryDisabled: !product.deliveryDisabled,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col p-6 overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full rounded-lg w-full md:w-[20rem] h-[20rem] shadow-lg group-hover:shadow-2xl">
            <div className="flex justify-between gap-4">
              <p className="text-2xl font-bold text-gray-800">{product.name}</p>

              <p className="text-2xl text-orange-700 font-bold">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-gray-500 font-medium">{category?.name}</p>

            <p className="text-gray-900 text-sm">
              Destacado:{" "}
              <span className="font-medium">{product.highlight ? "Si" : "No"}</span>
            </p>

            <p className="text-gray-900 text-sm">
              Disponible:{" "}
              <span className="font-medium">{product.disabled ? "No" : "Si"}</span>
            </p>

            <p className="text-gray-900 text-sm">
              Delivery:{" "}
              <span className="font-medium">
                {product.deliveryDisabled ? "No" : "Si"}
              </span>
            </p>

            <p className="text-gray-800 text-sm mt-4">{product.description}</p>

            <IconButton
              variant="text"
              title="Destacar"
              data-te-toggle="tooltip"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteModal(true);
              }}
              className="!fixed p-2 bottom-2 right-2 bg-red-50 bg-opacity-50 hover:bg-red-100 hover:bg-opacity-75"
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
          Editar Producto{" "}
          <span className="text-gray-800 font-medium italic">{product?.name}</span>
        </p>

        <ProductForm
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
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            disabled: product.disabled,
            highlight: product.highlight,
            deliveryDisabled: product.deliveryDisabled,
            category: category!,
            image,
          }}
        />
      </Modal>

      <Modal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <p className="text-xl font-light mb-4">Eliminar producto</p>

        <p className="mb-4 text-center">
          ¿Estás seguro que deseas eliminar el producto{" "}
          <span className="font-medium italic text-gray-800">{product.name}</span>?
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
