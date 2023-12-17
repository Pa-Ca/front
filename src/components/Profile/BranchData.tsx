import { FC, useEffect, useState } from "react";
import { useFetch } from "@hooks";
import { Modal } from "../Atoms/Modal";
import { FormikHelpers } from "formik";
import { BranchImages } from "./BranchImages";
import { TaxForm, TaxFormValues } from "./TaxForm";
import { FormSelect } from "../FormInputs/FormSelect";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDuration, formatLocalTime } from "@utils";
import { BranchForm, BranchFormValues } from "./BranchForm";
import { LinkText, PrimaryButton } from "../FormInputs/Buttons";
import { Carousel, IconButton } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { setBranchSelected, setBranches } from "src/store/slices/branches";
import defaultImage from "../../assets/images/default-product-image-without-bg.png";
import { BranchInterface, DefaultTaxInterface, Duration, LocalTime } from "@objects";
import {
  alertService,
  createBranch,
  getBranchImages,
  createDefaultTax,
  deleteDefaultTax,
} from "@services";
import {
  PlusIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

const branchToOption = (branch?: BranchInterface) => ({
  value: branch,
  name: branch?.name ?? "",
  id: branch?.id.toString() ?? "",
  description: branch?.location ?? "",
});

export const BranchData: FC = () => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();
  const business = useAppSelector((state) => state.business.data);
  const branches = useAppSelector((state) => state.branches.list);
  const branch = useAppSelector((state) => state.branches.selected);

  const [carouselKey, setCarouselKey] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [openCreateTax, setOpenCreateTax] = useState(false);
  const [openEditBranch, setOpenEditBranch] = useState(false);
  const [openEditImages, setOpenEditImages] = useState(false);
  const [openCreateBranch, setOpenCreateBranch] = useState(false);

  const handleBranchCreate = async (
    values: BranchFormValues,
    formik: FormikHelpers<BranchFormValues>
  ) => {
    if (!business?.id) return;

    const branch: BranchInterface = {
      id: 0,
      businessId: business.id,
      name: values.name,
      score: 0,
      capacity: +values.capacity,
      reservationPrice: +values.reservationPrice,
      mapsLink: values.mapsLink,
      location: values.location,
      overview: values.overview,
      visibility: values.visibility,
      reserveOff: values.reserveOff,
      phoneNumber: values.phoneNumber,
      type: values.type,
      hourIn: values.hourIn,
      hourOut: values.hourOut,
      averageReserveTime: values.averageReserveTime,
      dollarExchange: 1,
      deleted: false,
      defaultTaxes: [],
    };

    fetch((token: string) => createBranch(branch, token)).then((response) => {
      if (response.isError || !response.data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      setCarouselKey(Math.random().toString());
      dispatch(setBranches([...branches, response.data]));
      dispatch(setBranchSelected(response.data));
      setOpenCreateBranch(false);
    });
  };

  const handleTaxCreate = async (
    values: TaxFormValues,
    formik: FormikHelpers<TaxFormValues>
  ) => {
    if (!branch?.id || !business?.id) return;

    const tax: DefaultTaxInterface = {
      id: 0,
      businessId: business.id,
      name: values.name,
      value: +values.value,
      isPercentage: values.type === "Porcentaje",
    };

    fetch((token: string) => createDefaultTax(tax, token)).then((response) => {
      if (response.isError || !response.data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      const updatedBranch = {
        ...branch,
        defaultTaxes: [...branch.defaultTaxes, response.data],
      };
      const branchIndex = branches.findIndex((b) => b.id === branch.id);
      const updatedBranches = [
        ...branches.slice(0, branchIndex),
        updatedBranch,
        ...branches.slice(branchIndex + 1),
      ];

      dispatch(setBranches(updatedBranches));
      dispatch(setBranchSelected(updatedBranch));
      setOpenCreateTax(false);
    });
  };

  const handleTaxDelete = async (taxId: number) => {
    if (!branch?.id) return;

    fetch((token: string) => deleteDefaultTax(taxId, token)).then((response) => {
      if (response.isError) {
        alertService.error(
          "Hubo un error al intentar eliminar la tarifa.",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      const updatedBranch = {
        ...branch,
        defaultTaxes: branch.defaultTaxes.filter((t) => t.id !== taxId)!,
      };
      const branchIndex = branches.findIndex((b) => b.id === branch.id);
      const updatedBranches = [
        ...branches.slice(0, branchIndex),
        updatedBranch,
        ...branches.slice(branchIndex + 1),
      ];

      dispatch(setBranches(updatedBranches));
      dispatch(setBranchSelected(updatedBranch));
    });
  };

  const handleBranchUpdate = (
    values: BranchFormValues,
    formik: FormikHelpers<BranchFormValues>
  ) => {
    if (!branch?.id || !business?.id) return;

    const updatedBranch: BranchInterface = {
      id: branch.id,
      businessId: business.id,
      name: values.name,
      score: branch.score,
      capacity: +values.capacity,
      reservationPrice: +values.reservationPrice,
      mapsLink: values.mapsLink,
      location: values.location,
      overview: values.overview,
      visibility: values.visibility,
      reserveOff: values.reserveOff,
      phoneNumber: values.phoneNumber,
      type: values.type,
      hourIn: values.hourIn,
      hourOut: values.hourOut,
      averageReserveTime: values.averageReserveTime,
      dollarExchange: branch.dollarExchange,
      deleted: false,
      defaultTaxes: branch.defaultTaxes,
    };

    fetch((token: string) => createBranch(updatedBranch, token)).then((response) => {
      if (response.isError || !response.data) {
        formik.setFieldError(
          "name",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      const branchIndex = branches.findIndex((b) => b.id === branch?.id);
      const updatedBranches = [
        ...branches.slice(0, branchIndex),
        response.data,
        ...branches.slice(branchIndex + 1),
      ];
      dispatch(setBranches(updatedBranches));
      dispatch(setBranchSelected(response.data));
      setOpenEditBranch(false);
    });
  };

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchImages(branch.id, token)).then((response) => {
      if (response.isError || !response.data) return;

      setCarouselKey(Math.random().toString());
      setImages(response.data.images);
    });
  }, [branch?.id, fetch]);

  return (
    <div className="flex flex-col w-full gap-6 text-lg sm:gap-2 text-sm sm:text-md">
      {!!branch && (
        <>
          <p className="text-lg font-light">
            Detalles de{" "}
            <span className="italic font-medium text-gray-700">{branch?.name}</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 sm:items-center">
            <FormSelect
              label=""
              id="branches"
              name="branches"
              selected={branchToOption(branch)}
              options={branches.map((branch) => branchToOption(branch))}
              onChange={(branch) => !!branch && dispatch(setBranchSelected(branch))}
            />

            <PrimaryButton
              className="w-full sm:w-40"
              onClick={() => setOpenCreateBranch(true)}
            >
              Crear Sucursal
            </PrimaryButton>
          </div>

          <div className="flex flex-1 flex-col gap-8">
            <div className="flex flex-1 flex-col-reverse lg:flex-row gap-8 mt-8">
              <div className="flex relative lg:flex-1 lg:max-w-[50%]">
                <Carousel
                  key={carouselKey}
                  transition={{ duration: 1 }}
                  className="flex-1 h-[25rem] sm:h-auto rounded-xl"
                  prevArrow={({ handlePrev }) => (
                    <IconButton
                      variant="text"
                      color="white"
                      size="lg"
                      onClick={handlePrev}
                      className="!absolute !bg-white !bg-opacity-50 hover:!bg-opacity-75 top-2/4 left-4 -translate-y-2/4"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </IconButton>
                  )}
                  nextArrow={({ handleNext }) => (
                    <IconButton
                      variant="text"
                      color="white"
                      size="lg"
                      onClick={handleNext}
                      className="!absolute !bg-white !bg-opacity-50 hover:!bg-opacity-75 top-2/4 !right-4 -translate-y-2/4"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </IconButton>
                  )}
                >
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`image-${index}`}
                      className="h-full w-full object-cover"
                    />
                  ))}
                </Carousel>

                <div
                  onClick={() => setOpenEditImages(true)}
                  className="absolute top-4 right-4 p-2 bg-orange-700 rounded-lg cursor-pointer shadow-lg hover:bg-orange-500"
                >
                  <PencilIcon className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="flex lg:flex-[1.5] flex-col gap-4 lg:max-w-[50%] sm:gap-2">
                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                  <p className="text-gray-800 font-light min-w-[9rem]">Ubicación:</p>
                  <p className="text-gray-800">{branch.location}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                  <p className="text-gray-800 font-light min-w-[9rem]">Tipo:</p>
                  <p className="text-gray-800">{branch.type}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                  <p className="text-gray-800 font-light min-w-[9rem]">Celular:</p>
                  <p className="text-gray-800">{branch.phoneNumber}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                  <p className="text-gray-800 font-light min-w-[9rem]">
                    Hora de apertura:
                  </p>
                  <p className="text-gray-800">{formatLocalTime(branch.hourIn)}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                  <p className="text-gray-800 font-light min-w-[9rem]">Hora de cierre:</p>
                  <p className="text-gray-800">{formatLocalTime(branch.hourOut)}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                  <p className="text-gray-800 font-light min-w-[9rem]">Capacidad:</p>
                  <p className="text-gray-800">{branch.capacity}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                  <p className="text-gray-800 font-light min-w-[9rem]">
                    Coste de reserva:
                  </p>
                  <p className="text-gray-800">{branch.reservationPrice.toFixed(2)} $</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                  <p className="text-gray-800 font-light min-w-[9rem]">
                    Tiempo de reserva:
                  </p>
                  <p className="text-gray-800">
                    {formatDuration(branch.averageReserveTime)}{" "}
                    <span className="italic font-light">(En promedio)</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
                  <p className="text-gray-800 font-light min-w-[9rem]">Descripción:</p>
                  <p className="text-gray-800 text-sm font-normal">{branch.overview}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
                  <p className="text-gray-800 font-light min-w-[9rem]">Visible:</p>
                  <p className="text-gray-800">{branch.visibility ? "Si" : "No"}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
                  <p className="text-gray-800 font-light min-w-[9rem]">
                    Acepta reservas:
                  </p>
                  <p className="text-gray-800">{branch.reserveOff ? "No" : "Si"}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
                  <p className="text-gray-800 font-light min-w-[9rem]">Google maps:</p>
                  <LinkText
                    text="Enlace"
                    disabled={!branch.mapsLink}
                    onClick={() => window.open(branch.mapsLink, "_blank")}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
                  <p className="text-gray-800 font-light min-w-[9rem]">
                    Tarifas por defecto:
                  </p>

                  <div className="flex flex-col">
                    {branch.defaultTaxes.map((tax) => (
                      <div
                        key={tax.id}
                        className="flex gap-20 items-center justify-between"
                      >
                        <p className="text-gray-800 font-light">{tax.name}:</p>

                        <div className="flex items-center gap-2">
                          <p className="text-gray-800">
                            {tax.value.toFixed(2)} {tax.isPercentage ? "%" : "$"}
                          </p>
                          <IconButton
                            variant="text"
                            color="red"
                            size="sm"
                            onClick={() => handleTaxDelete(tax.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </div>
                      </div>
                    ))}

                    <div>
                      <PrimaryButton
                        className="!p-1 mt-1"
                        onClick={() => setOpenCreateTax(true)}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </PrimaryButton>
                    </div>
                  </div>
                </div>

                <div
                  className="flex w-full h-full items-end"
                  onClick={() => setOpenEditBranch(true)}
                >
                  <PrimaryButton className="w-full sm:w-24 h-7 !py-1 text-xs">
                    Editar
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!branch && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex w-full justify-end">
            <PrimaryButton
              className="w-full sm:w-40"
              onClick={() => setOpenCreateBranch(true)}
            >
              Crear Sucursal
            </PrimaryButton>
          </div>

          <img
            src={defaultImage}
            alt="Branch not found"
            className="w-[13rem] h-[13rem] sm:w-[20rem] sm:h-[20rem] object-cover opacity-[0.6]"
          />
          <p className="text-xl text-center font-light text-gray-800">
            Parece que aún no tienes sucursales. Crea una para empezar.
          </p>
        </div>
      )}

      <Modal
        open={openCreateBranch}
        setOpen={setOpenCreateBranch}
        className="w-full md:m-8 max-w-[60rem]"
      >
        <p className="text-2xl font-light mb-4">Crear Sucursal</p>

        <BranchForm
          onSubmit={handleBranchCreate}
          onCancel={() => setOpenCreateBranch(false)}
        />
      </Modal>

      <Modal
        open={openCreateTax}
        setOpen={setOpenCreateTax}
        className="w-full m-8 max-w-[30rem]"
      >
        <p className="text-2xl font-light mb-4">Crear Tarifa</p>

        <TaxForm onSubmit={handleTaxCreate} onCancel={() => setOpenCreateTax(false)} />
      </Modal>

      <Modal
        open={openEditBranch}
        setOpen={setOpenEditBranch}
        className="w-full m-8 max-w-[60rem]"
      >
        <p className="text-2xl font-light mb-4">
          Editar Sucursal{" "}
          <span className="text-gray-800 font-medium italic">{branch?.name}</span>
        </p>

        <BranchForm
          initialValues={{
            name: branch?.name ?? "",
            capacity: branch?.capacity.toString() ?? "",
            reservationPrice: branch?.reservationPrice.toString() ?? "",
            mapsLink: branch?.mapsLink ?? "",
            location: branch?.location ?? "",
            overview: branch?.overview ?? "",
            visibility: branch?.visibility ?? false,
            reserveOff: branch?.reserveOff ?? false,
            phoneNumber: branch?.phoneNumber ?? "",
            type: branch?.type ?? "",
            hourIn: branch?.hourIn as LocalTime,
            hourOut: branch?.hourOut as LocalTime,
            averageReserveTime: branch?.averageReserveTime as Duration,
          }}
          onSubmit={handleBranchUpdate}
          onCancel={() => setOpenCreateBranch(false)}
        />
      </Modal>

      <Modal
        open={openEditImages}
        setOpen={setOpenEditImages}
        className="w-full m-6 md:m-8 max-w-[45rem]"
      >
        <p className="text-xl font-light mb-4">
          Imágenes de <span className="font-normal italic">{branch?.name}</span>
        </p>

        <BranchImages images={images} setImages={setImages} />

        <div className="flex w-full justify-end mt-8">
          <PrimaryButton className="w-32" onClick={() => setOpenEditImages(false)}>
            Cerrar
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
