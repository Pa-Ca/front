import { FC, useState } from "react";
import { useFetch } from "@hooks";
import { Modal } from "../Atoms/Modal";
import { FormikHelpers } from "formik";
import { BranchCarousel } from "./BranchCarousel";
import { TaxForm, TaxFormValues } from "./TaxForm";
import { PlusIcon } from "@heroicons/react/24/solid";
import { FormSelect } from "../FormInputs/FormSelect";
import { IconButton } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDuration, formatLocalTime } from "@utils";
import { BranchForm, BranchFormValues } from "./BranchForm";
import { LinkText, PrimaryButton } from "../FormInputs/Buttons";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { setBranchSelected, setBranches } from "src/store/slices/branches";
import defaultImage from "../../assets/images/default-product-image-without-bg.png";
import { BranchInterface, DefaultTaxInterface, Duration, LocalTime } from "@objects";
import {
  alertService,
  createBranch,
  createDefaultTax,
  deleteDefaultTax,
} from "@services";

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

  const [openCreateTax, setOpenCreateTax] = useState(false);
  const [openEditBranch, setOpenEditBranch] = useState(false);
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
          response.error?.message ?? response.exception?.message,
          { autoClose: false }
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
              <div className="flex lg:flex-1 lg:max-w-[50%]">
                <BranchCarousel />
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

                <div className="flex w-full mt-8" onClick={() => setOpenEditBranch(true)}>
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
    </div>
  );
};
