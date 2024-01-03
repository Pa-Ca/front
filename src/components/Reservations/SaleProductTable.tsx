import { FC, useContext, useEffect, useState } from "react";
import { useFetch } from "@hooks";
import classNames from "classnames";
import { FormText } from "../FormInputs/FormText";
import { FormSearch } from "../FormInputs/FormSearch";
import { IconButton } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ProductInterface, SaleProductInterface } from "@objects";
import { ReservationsContext, handleIntegerChange } from "@utils";
import {
  alertService,
  updateSaleProduct,
  deleteSaleProduct,
  createSaleProduct,
} from "@services";

interface SaleProductTableRowProps {
  index: number;
  saleId: number;
  product: SaleProductInterface;
}
const SaleProductTableRow: FC<SaleProductTableRowProps> = ({
  index,
  saleId,
  product,
}) => {
  const fetch = useFetch();
  const { setSales } = useContext(ReservationsContext);
  const [amount, setAmount] = useState(product.amount.toString());

  const handleUpdate = async () => {
    const dto = {
      ...product,
      amount: +amount,
    };
    return await fetch((token: string) => updateSaleProduct(dto, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al actualizar el producto de la venta",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        setSales((prev) => {
          const saleIndex = prev.findIndex((s) => s.sale.id === saleId);
          const newSales = [...prev];
          const productIndex = newSales[saleIndex].products.findIndex(
            (p) => p.id === product.id
          );
          const newProducts = [...newSales[saleIndex].products];
          newProducts[productIndex] = dto;
          newSales[saleIndex].products = newProducts;

          return newSales;
        });
      }
    );
  };

  const handleDelete = async () => {
    return await fetch((token: string) => deleteSaleProduct(product.id, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al eliminar el producto de la venta",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        setSales((prev) => {
          const saleIndex = prev.findIndex((s) => s.sale.id === saleId);
          const newSales = [...prev];
          newSales[saleIndex].products = newSales[saleIndex].products.filter(
            (p) => p.id !== product.id
          );

          return newSales;
        });
      }
    );
  };

  useEffect(() => {
    setAmount(product.amount.toString());
  }, [product.amount]);

  return (
    <tr
      className={classNames(
        "hover:bg-gray-100 text-sm",
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      )}
    >
      <td className="px-4 py-4 font-semibold text-gray-800">{product.name}</td>

      <td className="px-4 py-4 font-semibold text-right text-gray-500">
        ${product.price.toFixed(2)}
      </td>

      <td className="flex justify-end items-center gap-3 px-4 py-4 font-semibold text-right text-gray-500">
        <IconButton
          color="green"
          size="sm"
          variant="outlined"
          title="Actualizar cantidad"
          data-te-toggle="tooltip"
          className="rounded-full border-2"
          onClick={handleUpdate}
          disabled={product.amount.toString() === amount || !amount || !+amount}
        >
          <CheckIcon className="w-5 h-5" />
        </IconButton>

        <FormText
          label=""
          id={`amount-${product.id}`}
          name={`amount-${product.id}`}
          autoComplete="off"
          placeholder="Cantidad"
          value={amount}
          onChange={(e) =>
            handleIntegerChange(e, (event) => setAmount(event.target.value), 0)
          }
          containerClassName="w-20"
        />
      </td>

      <td className="px-4 py-4 font-semibold text-right text-gray-500">
        ${(product.price * product.amount).toFixed(2)}
      </td>

      <td className="px-4 py-4 font-semibold text-right text-gray-500 w-8">
        <IconButton
          color="red"
          size="md"
          variant="outlined"
          title="Eliminar producto de la venta"
          data-te-toggle="tooltip"
          className="rounded-full"
          onClick={handleDelete}
        >
          <TrashIcon className="w-5 h-5" />
        </IconButton>
      </td>
    </tr>
  );
};

interface SaleProductTableProps {
  saleId: number;
  saleProducts: SaleProductInterface[];
}
export const SaleProductTable: FC<SaleProductTableProps> = ({ saleId, saleProducts }) => {
  const fetch = useFetch();
  const { products, categories, setSales } = useContext(ReservationsContext);

  const [amount, setAmount] = useState("1");
  const [product, setProduct] = useState<ProductInterface | null>(null);

  const handleCreation = async () => {
    if (!product) return;

    const saleProduct = saleProducts.find((p) => p.productId === product.id);
    if (saleProduct) {
      return await handleUpdate({
        ...saleProduct,
        amount: saleProduct.amount + +amount,
      });
    }

    const dto = {
      id: 0,
      saleId,
      productId: product.id,
      name: product.name,
      price: product.price,
      amount: +amount,
    };
    return await fetch((token: string) => createSaleProduct(dto, token)).then(
      (response) => {
        const { data } = response;
        if (response.isError || !data) {
          alertService.error(
            "Error al agregar el producto a la venta",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        setSales((prev) => {
          const saleIndex = prev.findIndex((s) => s.sale.id === saleId);
          const newSales = [...prev];
          const newProducts = [...newSales[saleIndex].products, data];
          newSales[saleIndex].products = newProducts;

          return newSales;
        });
      }
    );
  };

  const handleUpdate = async (product: SaleProductInterface) => {
    return await fetch((token: string) => updateSaleProduct(product, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al actualizar el producto de la venta",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        setSales((prev) => {
          const saleIndex = prev.findIndex((s) => s.sale.id === saleId);
          const newSales = [...prev];
          const productIndex = newSales[saleIndex].products.findIndex(
            (p) => p.id === product.id
          );
          const newProducts = [...newSales[saleIndex].products];
          newProducts[productIndex] = product;
          newSales[saleIndex].products = newProducts;

          return newSales;
        });
      }
    );
  };

  return (
    <div className="flex w-full flex-col bg-white rounded-lg border px-8 pb-6 pt-4">
      <table className="table-auto w-full">
        <thead>
          <tr className="text-sm font-semibold text-gray-800 bg-white">
            <td className="text-left px-4 py-2">PRODUCTO</td>

            <td className="truncate text-right px-4 py-2">PRECIO UNITARIO</td>

            <td className="text-right px-4 py-2">CANTIDAD</td>

            <td className="text-right px-4 py-2">TOTAL</td>

            <td />
          </tr>
        </thead>
        <tbody>
          {saleProducts.map((product, index) => (
            <SaleProductTableRow
              key={product.id}
              saleId={saleId}
              index={index}
              product={product}
            />
          ))}

          <tr
            className={classNames(
              "hover:bg-gray-100 text-sm",
              saleProducts.length % 2 === 0 ? "bg-gray-50" : "bg-white"
            )}
          >
            <td className="px-4 py-4 font-semibold text-gray-800">
              <FormSearch
                label=""
                id="product"
                name="product"
                placeholder="Seleccionar un producto"
                defaultOption="Seleccionar un producto"
                selected={{
                  value: product,
                  name: product?.name ?? "",
                  id: product?.id.toString() ?? "",
                }}
                options={products.map((product) => ({
                  value: product,
                  name: product.name,
                  id: product.id.toString(),
                  description:
                    categories.find((c) => c.id === product.categoryId)?.name ?? "",
                }))}
                onSelectOption={(product) => setProduct(product)}
                containerClassName="flex-1 w-full md:w-auto"
              />
            </td>

            <td className="px-4 py-4 font-semibold text-right text-gray-500">
              {product ? `$${product.price.toFixed(2)}` : " "}
            </td>

            <td className="flex justify-end items-center gap-3 px-4 py-4 font-semibold text-right text-gray-500">
              <FormText
                label=""
                id="amount"
                name="amount"
                autoComplete="off"
                placeholder="Cantidad"
                value={amount}
                onChange={(e) =>
                  handleIntegerChange(e, (event) => setAmount(event.target.value), 0)
                }
                containerClassName="w-20"
              />
            </td>

            <td className="px-4 py-4 font-semibold text-right text-gray-500">
              {product && amount
                ? `$${(product.price * parseInt(amount)).toFixed(2)}`
                : ""}
            </td>

            <td className="px-4 py-4 font-semibold text-right text-gray-500 w-8">
              <IconButton
                color="orange"
                size="md"
                variant="outlined"
                title="Agregar producto a la venta"
                data-te-toggle="tooltip"
                onClick={handleCreation}
                disabled={!product || !amount || !+amount}
                className="rounded-full border-2"
              >
                <PlusIcon className="w-5 h-5" />
              </IconButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
