import { FC, useEffect, useMemo, useState } from "react";
import { useFetch } from "@hooks";
import { FormikHelpers } from "formik";
import { useAppSelector } from "src/store/hooks";
import { InboxIcon, TagIcon } from "@heroicons/react/24/outline";
import { ProductCard } from "src/components/Products/ProductCard";
import { ProductCategoryInterface, ProductInterface } from "@objects";
import { PaginationFooter } from "src/components/Molecules/PaginationFooter";
import defaultImage from "../../assets/images/default-product-image-without-bg.png";
import {
  ProductCategoryForm,
  ProductCategoryFormValues,
} from "src/components/Products/ProductCategoryForm";
import {
  alertService,
  createProduct,
  deleteProduct,
  updateProduct,
  getBranchProducts,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getBranchProductCategories,
} from "@services";
import {
  Modal,
  Switch,
  FormText,
  FormSearch,
  FormSelect,
  ProductForm,
  PrimaryButton,
  SecondaryButton,
  BusinessMainPage,
  ProductFormValues,
} from "@components";

const PRODUCTS_PER_PAGE = 24;
const ACTIONS = [
  { value: "0", id: "0", name: "Crear Producto" },
  { value: "1", id: "1", name: "Crear Categoría" },
  { value: "2", id: "2", name: "Editar Categoría" },
  { value: "3", id: "3", name: "Eliminar Categoría" },
];

const Products: FC = () => {
  const fetch = useFetch();
  const branch = useAppSelector((state) => state.branches.selected);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [onlyActives, setOnlyActives] = useState(false);
  const [onlyDelivery, setOnlyDelivery] = useState(false);
  const [onlyHighlights, setOnlyHighlights] = useState(false);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [categories, setCategories] = useState<ProductCategoryInterface[]>([]);
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false);
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
  const [categorySelected, setCategorySelected] = useState<ProductCategoryInterface>({
    id: -1,
    branchId: -1,
    name: "",
  });

  const categoryOptions = useMemo(() => {
    const defaultOption = {
      value: {
        id: -1,
        branchId: -1,
        name: "",
      },
      name: "",
      id: "-1",
    };
    return [
      defaultOption,
      ...categories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => ({
          value: item,
          name: item.name,
          id: item.id.toString(),
        })),
    ];
  }, [categories]);

  const categoryOptionSelected = useMemo(() => {
    return {
      value: categorySelected,
      name: categorySelected?.name ?? "",
      id: categorySelected?.id.toString() ?? "",
    };
  }, [categorySelected]);

  const filteredProducts = useMemo(() => {
    setPage(0);

    const tokens = search
      .toLowerCase()
      .split(" ")
      .filter((token) => token.length > 0);

    return products
      .filter((product) => {
        return (
          (!onlyHighlights || product.highlight) &&
          (!onlyActives || !product.disabled) &&
          (!onlyDelivery || !product.deliveryDisabled) &&
          (categorySelected.id === -1 || product.categoryId === categorySelected.id) &&
          tokens.every((token) => product.name.toLowerCase().includes(token))
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, onlyActives, onlyDelivery, onlyHighlights, search, categorySelected]);

  const paginatedProducts = useMemo(() => {
    const start = page * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(start, end);
  }, [page, filteredProducts]);

  const actions = useMemo(() => {
    return ACTIONS.filter((action) => categorySelected.id !== -1 || +action.id < 2);
  }, [categorySelected]);

  const handleAction = (action: string) => {
    switch (action) {
      case "0":
        setOpenCreateProductModal(true);
        break;
      case "1":
        setOpenCreateCategoryModal(true);
        break;
      case "2":
        setOpenEditCategoryModal(true);
        break;
      case "3":
        setOpenDeleteCategoryModal(true);
        break;
    }
  };

  const handleProductCreation = (
    values: ProductFormValues,
    formik: FormikHelpers<ProductFormValues>
  ) => {
    const product: ProductInterface = {
      id: 0,
      categoryId: values.category.id,
      name: values.name,
      description: values.description,
      price: +values.price,
      disabled: values.disabled,
      highlight: values.highlight,
      deliveryDisabled: values.deliveryDisabled,
    };

    fetch((token: string) => createProduct(product, token)).then((response) => {
      if (response.isError || !response.data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      const updatedProducts = [...products, response.data];
      setProducts(updatedProducts);
      setOpenCreateProductModal(false);
    });
  };

  const handleProductEdition = async (
    productId: number,
    values: ProductFormValues,
    formik: FormikHelpers<ProductFormValues>
  ) => {
    const product: ProductInterface = {
      id: productId,
      categoryId: values.category.id,
      name: values.name,
      description: values.description,
      price: +values.price,
      disabled: values.disabled,
      highlight: values.highlight,
      deliveryDisabled: values.deliveryDisabled,
    };

    return await fetch((token: string) => updateProduct(product, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          formik.setFieldError(
            "name",
            response.error?.message ?? response.exception?.message
          );
          return false;
        }

        const index = products.findIndex((p) => p.id === productId);
        const updatedProducts = [...products];
        updatedProducts[index] = product;
        setProducts(updatedProducts);
        return true;
      }
    );
  };

  const handleInlineProductEdition = async (product: ProductInterface) => {
    return await fetch((token: string) => updateProduct(product, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          alertService.error(
            "Hubo un error intentando actualizar el producto.",
            response.error?.message ?? response.exception?.message
          );
          return false;
        }

        const index = products.findIndex((p) => p.id === product.id);
        const updatedProducts = [...products];
        updatedProducts[index] = product;
        setProducts(updatedProducts);
        return true;
      }
    );
  };

  const handleProductDeletion = async (productId: number) => {
    return fetch((token: string) => deleteProduct(productId, token)).then((response) => {
      if (response.isError) {
        alertService.error(
          "Hubo un error intentando eliminar el producto.",
          response.error?.message ?? response.exception?.message
        );
        return false;
      }

      const index = products.findIndex((p) => p.id === productId);
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
      return true;
    });
  };

  const handleProductCategoryCreation = (
    values: ProductCategoryFormValues,
    formik: FormikHelpers<ProductCategoryFormValues>
  ) => {
    const category: ProductCategoryInterface = {
      id: 0,
      branchId: branch?.id ?? 0,
      name: values.name,
    };

    fetch((token: string) => createProductCategory(category, token)).then((response) => {
      if (response.isError || !response.data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      const updatedCategories = [...categories, response.data];
      setCategories(updatedCategories);
      setCategorySelected(response.data);
      setOpenCreateCategoryModal(false);
    });
  };

  const handleProductCategoryEdition = (
    values: ProductCategoryFormValues,
    formik: FormikHelpers<ProductCategoryFormValues>
  ) => {
    const category: ProductCategoryInterface = {
      ...categorySelected,
      name: values.name,
    };

    fetch((token: string) => updateProductCategory(category, token)).then((response) => {
      if (response.isError || !response.data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      const index = categories.findIndex((c) => c.id === category.id);
      const updatedCategories = [...categories];
      updatedCategories[index] = category;
      setCategories(updatedCategories);
      setCategorySelected(response.data);
      setOpenEditCategoryModal(false);
    });
  };

  const handleProductCategoryDeletion = async () => {
    if (categorySelected.id === -1) return;

    return fetch((token: string) =>
      deleteProductCategory(categorySelected.id, token)
    ).then((response) => {
      if (response.isError) {
        alertService.error(
          "Hubo un error intentando eliminar la categoría.",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      const index = categories.findIndex((c) => c.id === categorySelected.id);
      const updatedCategories = [...categories];
      updatedCategories.splice(index, 1);
      setCategories(updatedCategories);
      setCategorySelected({ id: -1, branchId: -1, name: "" });
      setOpenDeleteCategoryModal(false);
    });
  };

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchProducts(branch?.id, token, categories)).then(
      (response) => {
        if (response.isError || !response.data) {
          return;
        }

        setProducts(response.data.products);
      }
    );
  }, [branch?.id, categories, fetch]);

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchProductCategories(branch?.id, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          return;
        }
        setCategories(response.data.productCategories);
      }
    );
  }, [branch?.id, fetch]);

  useEffect(() => {
    document.title = "Productos - Pa'ca";
  }, []);

  return (
    <BusinessMainPage>
      {/* Header */}
      <div className="flex flex-col w-full gap-2 mb-4">
        <h1 className="text-[2rem] font-bold text-gray-800 leading-none">Productos</h1>
        <p className="text-2xl font-light leading-none">
          Sucursal <span className="font-medium italic">{branch?.name}</span>
        </p>
        <hr />
      </div>

      {/* Actions */}
      <div className="hidden md:flex w-full gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <PrimaryButton
            className="!min-w-48"
            onClick={() => setOpenCreateProductModal(true)}
          >
            <span>
              <InboxIcon className="inline w-5 h-5 mr-2" />
              Crear Producto
            </span>
          </PrimaryButton>

          <PrimaryButton
            className="!min-w-48"
            onClick={() => setOpenCreateCategoryModal(true)}
          >
            <span>
              <TagIcon className="inline w-5 h-5 mr-2" />
              Crear Categoría
            </span>
          </PrimaryButton>
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton
            className="!min-w-48"
            disabled={categorySelected.id === -1}
            onClick={() => setOpenEditCategoryModal(true)}
          >
            Editar Categoría
          </PrimaryButton>

          <SecondaryButton
            className="!min-w-48"
            disabled={categorySelected.id === -1}
            onClick={() => setOpenDeleteCategoryModal(true)}
          >
            Eliminar Categoría
          </SecondaryButton>
        </div>
      </div>
      <FormSelect
        label=""
        id="product-actions"
        name="product-actions"
        selected={{
          id: "action",
          value: "action",
          name: "Selecciona una acción",
        }}
        options={actions}
        onChange={handleAction}
        containerClassName="flex-1 md:hidden"
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row w-full gap-4 items-center mt-12 lg:mt-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1">
          <FormText
            label=""
            id="productSearch"
            name="productSearch"
            autoComplete="off"
            value={search}
            placeholder="Buscar producto"
            onChange={(e) => setSearch(e.target.value)}
            containerClassName="flex-[1.5] w-full md:w-auto"
          />

          <FormSearch
            label=""
            id="productCategory"
            name="productCategory"
            placeholder="Seleccionar una categoría"
            defaultOption="Seleccionar una categoría"
            selected={categoryOptionSelected}
            options={categoryOptions}
            onSelectOption={(category) => setCategorySelected(category)}
            containerClassName="flex-1 w-full md:w-auto"
          />
        </div>

        <div className="flex items-center w-full lg:w-auto flex-row gap-2 justify-between md:justify-end">
          <div className="flex flex-col gap-1 text-sm items-center text-center">
            Sólo Disponibles
            <Switch checked={onlyActives} onChange={setOnlyActives} />
          </div>

          <div className="flex flex-col gap-1 text-sm items-center text-center">
            Sólo Destacados
            <Switch checked={onlyHighlights} onChange={setOnlyHighlights} />
          </div>

          <div className="flex flex-col gap-1 text-sm items-center text-center">
            Sólo con Delivery
            <Switch checked={onlyDelivery} onChange={setOnlyDelivery} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div>
        <div className="flex flex-col items-center sm:flex-row flex-wrap gap-4 sm:gap-6 mt-8 sm:justify-evenly mb-6">
          {paginatedProducts.length > 0 &&
            paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                category={categories.find((c) => c.id === product.categoryId)}
                onInlineEdit={handleInlineProductEdition}
                onDelete={() => handleProductDeletion(product.id)}
                onEdit={(values, formik) =>
                  handleProductEdition(product.id, values, formik)
                }
              />
            ))}

          {paginatedProducts.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center">
              <img
                src={defaultImage}
                alt="Products not found"
                className="w-[13rem] h-[13rem] sm:w-[20rem] sm:h-[20rem] opacity-[0.6]"
              />
              <p className="text-xl text-center font-light text-gray-800">
                Parece que no hay productos que coincidan con tu búsqueda. Intenta creando
                uno nuevo.
              </p>
            </div>
          )}
        </div>

        <PaginationFooter
          currentPage={page}
          totalItems={filteredProducts.length}
          itemsPerPage={PRODUCTS_PER_PAGE}
          onPageChange={setPage}
        />
      </div>

      <Modal
        className="w-full sm:w-auto sm:min-w-[30rem]"
        open={openCreateCategoryModal}
        setOpen={setOpenCreateCategoryModal}
      >
        <p className="text-2xl font-light mb-4">Crear Categoría</p>

        <ProductCategoryForm
          onSubmit={handleProductCategoryCreation}
          onCancel={() => setOpenCreateCategoryModal(false)}
        />
      </Modal>

      <Modal
        className="w-full sm:w-auto sm:min-w-[30rem]"
        open={openEditCategoryModal}
        setOpen={setOpenEditCategoryModal}
      >
        <p className="text-2xl font-light mb-4">
          Editar Categoría{" "}
          <span className="text-gray-800 font-medium italic">
            {categorySelected?.name}
          </span>
        </p>

        <ProductCategoryForm
          onSubmit={handleProductCategoryEdition}
          initialValues={{ name: categorySelected?.name ?? "" }}
          onCancel={() => setOpenEditCategoryModal(false)}
        />
      </Modal>

      <Modal
        className="w-full max-w-[55rem] m-8"
        open={openCreateProductModal}
        setOpen={setOpenCreateProductModal}
      >
        <p className="text-2xl font-light mb-4">Crear Producto</p>

        <ProductForm
          categories={categories}
          onSubmit={handleProductCreation}
          onCancel={() => setOpenCreateProductModal(false)}
        />
      </Modal>

      <Modal
        open={openDeleteCategoryModal}
        setOpen={setOpenDeleteCategoryModal}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <p className="text-2xl text-center font-light mb-4">Eliminar categoría</p>

        {!products.some((p) => p.categoryId === categorySelected.id) ? (
          <>
            <p className="mb-4 text-center">
              ¿Estás seguro que deseas eliminar la categoría{" "}
              <span className="font-medium italic text-gray-800">
                {categorySelected.name}
              </span>
              ?
            </p>

            <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
              <SecondaryButton
                type="button"
                className="w-full sm:w-40"
                onClick={() => setOpenDeleteCategoryModal(false)}
              >
                Cancelar
              </SecondaryButton>

              <PrimaryButton
                onClick={handleProductCategoryDeletion}
                type="submit"
                className="w-full sm:w-40"
              >
                Eliminar
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-center">
              No se puede eliminar la categoría{" "}
              <span className="font-medium italic text-gray-800">
                {categorySelected.name}
              </span>{" "}
              porque tiene productos asociados.
            </p>

            <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-center">
              <PrimaryButton
                type="button"
                className="w-full sm:w-40"
                onClick={() => setOpenDeleteCategoryModal(false)}
              >
                Aceptar
              </PrimaryButton>
            </div>
          </>
        )}
      </Modal>
    </BusinessMainPage>
  );
};

export default Products;
