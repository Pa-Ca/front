import { FC, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useFetch } from "@hooks";
import classNames from "classnames";
import { FormikHelpers } from "formik";
import { useAppSelector } from "src/store/hooks";
import { TicketIcon } from "@heroicons/react/24/outline";
import { formatCouponDiscountType, formatCouponType } from "@utils";
import defaultImage from "../../assets/images/default-coupon-image-without-bg.png";
import {
  CouponType,
  CouponInterface,
  ProductInterface,
  CouponDiscountType,
  ProductCategoryInterface,
} from "@objects";
import {
  alertService,
  createCoupon,
  deleteCoupon,
  updateCoupon,
  getBranchCoupons,
  getBranchProducts,
  getBranchProductCategories,
} from "@services";
import {
  Modal,
  Switch,
  FormText,
  CouponCard,
  FormSelect,
  CouponForm,
  PrimaryButton,
  FormDatePicker,
  BusinessMainPage,
  CouponFormValues,
  PaginationFooter,
} from "@components";

const COUPONS_PER_PAGE = 12;
const TYPES = [
  { id: "", name: "", value: null },
  { id: CouponType.PRODUCT.toString(), name: "Producto", value: CouponType.PRODUCT },
  { id: CouponType.CATEGORY.toString(), name: "Categoría", value: CouponType.CATEGORY },
];
const DISCOUNT_TYPES = [
  { id: "", name: "", value: null },
  {
    id: CouponDiscountType.PERCENTAGE.toString(),
    name: "Porcentaje",
    value: CouponDiscountType.PERCENTAGE,
  },
  {
    id: CouponDiscountType.AMOUNT.toString(),
    name: "Monto",
    value: CouponDiscountType.AMOUNT,
  },
];

const Coupons: FC = () => {
  const fetch = useFetch();
  const branch = useAppSelector((state) => state.branches.selected);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [endDate, setEndDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [onlyActives, setOnlyActives] = useState(false);
  const [type, setType] = useState<CouponType | null>(null);
  const [coupons, setCoupons] = useState<CouponInterface[]>([]);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [openCreateCouponModal, setOpenCreateCouponModal] = useState(false);
  const [categories, setCategories] = useState<ProductCategoryInterface[]>([]);
  const [discountType, setDiscountType] = useState<CouponDiscountType | null>(null);

  const startDateData = useMemo(() => {
    return {
      startDate: startDate ?? null,
      endDate: startDate ?? null,
    };
  }, [startDate]);

  const endDateData = useMemo(() => {
    return {
      startDate: endDate ?? null,
      endDate: endDate ?? null,
    };
  }, [endDate]);

  const filteredCoupons = useMemo(() => {
    setPage(0);
    const tokens = search.split(" ");

    const result = coupons.filter(
      (coupon) =>
        tokens.every(
          (token) =>
            coupon.name.toLowerCase().includes(token.toLowerCase()) ||
            coupon.products.some((p) => p.name.toLowerCase().includes(token)) ||
            coupon.categories.some((c) => c.name.toLowerCase().includes(token))
        ) &&
        (!onlyActives || coupon.enabled) &&
        (!type || coupon.type === type) &&
        (!discountType || coupon.discountType === discountType) &&
        (!startDate || moment(coupon.startDate).isSameOrAfter(startDate)) &&
        (!endDate || moment(coupon.endDate).isSameOrBefore(endDate))
    );
    return result;
  }, [coupons, search, type, discountType, startDate, endDate, onlyActives]);

  const paginatedCoupons = useMemo(() => {
    const start = page * COUPONS_PER_PAGE;
    const end = start + COUPONS_PER_PAGE;

    return filteredCoupons.slice(start, end);
  }, [page, filteredCoupons]);

  const handleCouponCreation = (
    values: CouponFormValues,
    formik: FormikHelpers<CouponFormValues>
  ) => {
    const coupon: CouponInterface = {
      id: 0,
      type: values.type,
      discountType: values.discountType,
      name: values.name,
      value: +values.value,
      enabled: values.enabled,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      products: values.products,
      categories: values.categories,
    };

    fetch((token: string) => createCoupon(coupon, token)).then((response) => {
      if (response.isError || !response.data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      const updatedCoupons = [...coupons, response.data];
      setCoupons(updatedCoupons);
      setOpenCreateCouponModal(false);
    });
  };

  const handleCouponEdition = async (
    couponId: number,
    values: CouponFormValues,
    formik: FormikHelpers<CouponFormValues>
  ) => {
    const coupon: CouponInterface = {
      id: couponId,
      type: values.type,
      discountType: values.discountType,
      name: values.name,
      value: +values.value,
      enabled: values.enabled,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      products: values.products,
      categories: values.categories,
    };

    return await fetch((token: string) => updateCoupon(coupon, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          formik.setFieldError(
            "name",
            response.error?.message ?? response.exception?.message
          );
          return false;
        }

        const index = coupons.findIndex((p) => p.id === couponId);
        const updatedCoupons = [...coupons];
        updatedCoupons[index] = coupon;
        setCoupons(updatedCoupons);
        return true;
      }
    );
  };

  const handleInlineCouponEdition = async (coupon: CouponInterface) => {
    return await fetch((token: string) => updateCoupon(coupon, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          alertService.error(
            "Hubo un error intentando actualizar el cupón.",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return false;
        }

        const index = coupons.findIndex((p) => p.id === coupon.id);
        const updatedCoupons = [...coupons];
        updatedCoupons[index] = coupon;
        setCoupons(updatedCoupons);
        return true;
      }
    );
  };

  const handleCouponDeletion = async (couponId: number) => {
    return fetch((token: string) => deleteCoupon(couponId, token)).then((response) => {
      if (response.isError) {
        alertService.error(
          "Hubo un error intentando eliminar el producto.",
          response.error?.message ?? response.exception?.message,
          { autoClose: false }
        );
        return false;
      }

      const index = coupons.findIndex((p) => p.id === couponId);
      const updatedCoupons = [...coupons];
      updatedCoupons.splice(index, 1);
      setCoupons(updatedCoupons);
      return true;
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
    if (!branch?.id) return;

    fetch((token: string) => getBranchCoupons(branch?.id, token)).then((response) => {
      if (response.isError || !response.data) {
        return;
      }

      setCoupons(response.data.coupons);
    });
  }, [branch?.id, fetch]);

  useEffect(() => {
    document.title = "Cupones - Pa'ca";
  }, []);

  return (
    <BusinessMainPage>
      {/* Header */}
      <div className="flex flex-col w-full gap-2 mb-4">
        <h1 className="text-[2rem] font-bold text-gray-800 leading-none">Cupones</h1>
        <p className="text-2xl font-light leading-none">
          Sucursal <span className="font-medium italic">{branch?.name}</span>
        </p>
        <hr />
      </div>

      {/* Actions */}
      <div className="flex w-full">
        <PrimaryButton
          className="w-full sm:w-auto !min-w-[12rem]"
          onClick={() => setOpenCreateCouponModal(true)}
        >
          <span>
            <TicketIcon className="inline w-5 h-5 mr-2" />
            Crear Cupon
          </span>
        </PrimaryButton>
      </div>

      {/* Filters */}
      <div className="flex flex-col 2xl:flex-row w-full gap-4 items-center mt-12 2xl:mt-6">
        <FormText
          label=""
          id="couponSearch"
          name="couponSearch"
          autoComplete="off"
          value={search}
          placeholder="Buscar cupón"
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="flex-[1.5] w-full 2xl:w-auto"
        />

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full 2xl:w-auto">
          <div className="flex flex-col sm:flex-row gap-4 w-full 2xl:w-auto">
            <div className="w-full 2xl:w-48">
              <FormSelect
                label=""
                id="couponType"
                name="couponType"
                defaultOption="Tipo de cupón"
                selected={{
                  value: type,
                  name: type ? formatCouponType(type) : "",
                  id: type?.toString() ?? "",
                }}
                options={TYPES}
                onChange={(type) => setType(type)}
              />
            </div>

            <div className="w-full 2xl:w-48">
              <FormSelect
                label=""
                id="discountType"
                name="discountType"
                defaultOption="Tipo de descuento"
                selected={{
                  value: discountType,
                  name: discountType ? formatCouponDiscountType(discountType) : "",
                  id: discountType?.toString() ?? "",
                }}
                options={DISCOUNT_TYPES}
                onChange={(discountType) => setDiscountType(discountType)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full 2xl:w-auto">
            <div className="w-full 2xl:w-32">
              <FormDatePicker
                label=""
                id="startDate"
                name="startDate"
                useRange={false}
                maxDate={endDate}
                value={startDateData}
                placeholder="Fecha inicial"
                toggleClassName={(oldClassName) =>
                  classNames(oldClassName, "text-orange-700")
                }
                onChange={(e) =>
                  setStartDate(e?.startDate ? moment(e?.startDate).toDate() : undefined)
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
                containerClassName="w-full"
              />
            </div>

            <div className="w-full 2xl:w-32">
              <FormDatePicker
                id="endDate"
                name="endDate"
                label=""
                useRange={false}
                placeholder="Fecha final"
                minDate={startDate}
                value={endDateData}
                toggleClassName={(oldClassName) =>
                  classNames(oldClassName, "text-orange-700")
                }
                onChange={(e) =>
                  setEndDate(e?.endDate ? moment(e?.endDate).toDate() : undefined)
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
                containerClassName="w-full"
              />
            </div>
          </div>

          <div className="flex w-full lg:w-auto justify-end">
            <div className="flex flex-col gap-1 text-sm items-center text-center">
              <p className="truncate">Sólo Disponibles</p>
              <Switch checked={onlyActives} onChange={setOnlyActives} />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div>
        <div className="flex flex-col items-center sm:flex-row flex-wrap gap-4 sm:gap-6 mt-8 sm:justify-evenly mb-6">
          {paginatedCoupons.length > 0 &&
            paginatedCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                products={products}
                categories={categories}
                onInlineEdit={handleInlineCouponEdition}
                onDelete={() => handleCouponDeletion(coupon.id)}
                onEdit={(values, formik) =>
                  handleCouponEdition(coupon.id, values, formik)
                }
              />
            ))}

          {paginatedCoupons.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center">
              <img
                src={defaultImage}
                alt="Products not found"
                className="my-8 h-[13rem] sm:h-[16rem] opacity-[0.6]"
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
          totalItems={filteredCoupons.length}
          itemsPerPage={COUPONS_PER_PAGE}
          onPageChange={setPage}
        />
      </div>

      <Modal
        className="w-full max-w-[55rem] m-8 overflow-show"
        open={openCreateCouponModal}
        setOpen={setOpenCreateCouponModal}
      >
        <p className="text-2xl font-light mb-4">Crear Cupón</p>

        <CouponForm
          products={products}
          categories={categories}
          onSubmit={handleCouponCreation}
          onCancel={() => setOpenCreateCouponModal(false)}
        />
      </Modal>
    </BusinessMainPage>
  );
};

export default Coupons;
