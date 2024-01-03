import { FC, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useFetch } from "@hooks";
import classNames from "classnames";
import { ReservationsContext } from "@utils";
import { Chip } from "@material-tailwind/react";
import { useAppSelector } from "src/store/hooks";
import { OngoingSales } from "src/components/Reservations/OngoingSales";
import { HistoricSales } from "src/components/Reservations/HistoricSales";
import { BusinessMainPage, FormSelect, PendingReservations } from "@components";
import { AcceptedReservations } from "src/components/Reservations/AcceptedReservations";
import { HistoricReservations } from "src/components/Reservations/HistoricReservations";
import {
  SaleStatus,
  SaleInterface,
  TableInterace,
  ProductInterface,
  ReservationStatus,
  HISTORIC_SALE_STATUS,
  ProductCategoryInterface,
  ReservationInfoInterface,
  HISTORIC_RESERVATION_STATUS,
} from "@objects";
import {
  alertService,
  getBranchSales,
  getBranchTables,
  startReservation,
  acceptReservation,
  getBranchProducts,
  getBranchReservations,
  getBranchProductCategories,
} from "@services";
import {
  ClockIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const TABS = [
  { name: "Historial", icon: CalendarDaysIcon },
  { name: "Mesa", icon: BuildingStorefrontIcon },
  { name: "Reservas Activas", icon: ClipboardDocumentCheckIcon },
  { name: "Reservas Pendiente", icon: ClockIcon },
];
const PAGE_SIZE = 10;

enum HistoricMode {
  SALES,
  RESERVATIONS,
}

const Reservations: FC = () => {
  const fetch = useFetch();
  const branch = useAppSelector((state) => state.branches.selected);

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [fullname, setFullname] = useState("");
  const [endTime, setEndTime] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [totalHistoric, setTotalHistoric] = useState(0);
  const [sales, setSales] = useState<SaleInterface[]>([]);
  const [tables, setTables] = useState<TableInterace[]>([]);
  const [mode, setMode] = useState(HistoricMode.RESERVATIONS);
  const [identityDocument, setIdentityDocument] = useState("");
  const [status, setStatus] = useState<ReservationStatus[]>([]);
  const [saleStatus, setSaleStatus] = useState<SaleStatus[]>([]);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [pending, setPending] = useState<ReservationInfoInterface[]>([]);
  const [started, setStarted] = useState<ReservationInfoInterface[]>([]);
  const [historicSales, setHistoricSales] = useState<SaleInterface[]>([]);
  const [accepted, setAccepted] = useState<ReservationInfoInterface[]>([]);
  const [historic, setHistoric] = useState<ReservationInfoInterface[]>([]);
  const [categories, setCategories] = useState<ProductCategoryInterface[]>([]);

  const tabs = useMemo(() => {
    return TABS.map((tab, index) => ({
      ...tab,
      count:
        index === 0
          ? undefined
          : index === 1
          ? sales.length
          : index === 2
          ? accepted.length
          : index === 3
          ? pending.length
          : undefined,
    }));
  }, [sales.length, accepted.length, pending.length]);

  const handleRefresh = () => setRefresh(Math.random());

  const handleModeChange = () => {
    if (mode === HistoricMode.SALES) setMode(HistoricMode.RESERVATIONS);
    else setMode(HistoricMode.SALES);
  };

  const handleStartReservation = async (reservation: ReservationInfoInterface) => {
    const reservationId = reservation.reservation.id;

    return await fetch((token: string) => startReservation(reservationId, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al iniciar la reserva",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        handleRefresh();
      }
    );
  };

  const handleAcceptReservation = async (reservation: ReservationInfoInterface) => {
    const reservationId = reservation.reservation.id;

    return await fetch((token: string) => acceptReservation(reservationId, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al aceptar la reserva",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        handleRefresh();
      }
    );
  };

  const handleRejectReservation = async (reservation: ReservationInfoInterface) => {
    const reservationId = reservation.reservation.id;

    return await fetch((token: string) => startReservation(reservationId, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al iniciar la reserva",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        handleRefresh();
      }
    );
  };

  const handleRetireReservation = async (reservation: ReservationInfoInterface) => {
    const reservationId = reservation.reservation.id;

    return await fetch((token: string) => startReservation(reservationId, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al iniciar la reserva",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        handleRefresh();
      }
    );
  };

  const handleCancelReservation = async (reservation: ReservationInfoInterface) => {
    const reservationId = reservation.reservation.id;

    return await fetch((token: string) => startReservation(reservationId, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error(
            "Error al iniciar la reserva",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        handleRefresh();
      }
    );
  };

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) =>
      getBranchReservations(
        branch.id,
        token,
        page,
        PAGE_SIZE,
        startTime,
        endTime,
        fullname,
        identityDocument,
        status.length > 0 ? status : HISTORIC_RESERVATION_STATUS
      )
    ).then((response) => {
      if (response.isError || !response.data) {
        alertService.error(
          "Error al obtener las reservas",
          response.error?.message ?? response.exception?.message,
          { autoClose: false }
        );
        return;
      }

      setPending(response.data.pendingReservations);
      setStarted(response.data.startedReservations);
      setAccepted(response.data.acceptedReservations);
      setHistoric(
        response.data.historicReservations.sort((a, b) => {
          let result = b.reservation.reservationDateIn.localeCompare(
            a.reservation.reservationDateIn
          );
          if (result === 0) {
            result = b.reservation.reservationDateOut.localeCompare(
              a.reservation.reservationDateOut
            );
          }
          if (result === 0) {
            result = b.reservation.requestDate.localeCompare(a.reservation.requestDate);
          }

          return result;
        })
      );
      setTotalHistoric(response.data.totalHistoricElements);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch?.id, page, refresh, fetch]);

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchTables(branch.id, token)).then((response) => {
      if (response.isError || !response.data) {
        alertService.error(
          "Error al obtener mesas",
          response.error?.message ?? response.exception?.message,
          { autoClose: false }
        );
        return;
      }

      setTables(response.data.tables.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }, [branch?.id, fetch]);

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) =>
      getBranchSales(
        branch.id,
        token,
        tables,
        page,
        PAGE_SIZE,
        startTime,
        endTime,
        fullname,
        identityDocument,
        saleStatus.length > 0 ? saleStatus : HISTORIC_SALE_STATUS
      )
    ).then((response) => {
      if (response.isError || !response.data) {
        alertService.error(
          "Error al obtener ventas",
          response.error?.message ?? response.exception?.message,
          { autoClose: false }
        );
        return;
      }

      setSales(
        response.data.ongoingSalesInfo.sort((a, b) =>
          moment(a.sale.startTime).diff(moment(b.sale.startTime))
        )
      );
      setHistoricSales(
        response.data.historicSalesInfo.sort((a, b) =>
          moment(b.sale.startTime).diff(moment(a.sale.startTime))
        )
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch?.id, page, tables, refresh, fetch]);

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
    setPage(0);
  }, [mode]);

  useEffect(() => {
    document.title = "Reservas - Pa'ca";
  }, []);

  return (
    <BusinessMainPage>
      {/* Header */}
      <div className="flex flex-col w-full gap-2 mb-4">
        <h1 className="text-[2rem] font-bold text-gray-800 leading-none">Reservas</h1>
        <p className="text-2xl font-light leading-none">
          Sucursal <span className="font-medium italic">{branch?.name}</span>
        </p>
        <hr />
      </div>

      {/* Navigation */}
      <div className="mt-4 mb-8">
        <div className="md:hidden">
          <FormSelect
            id="tabs"
            name="tabs"
            label=""
            selected={{ value: tab, name: TABS[tab].name, id: tab.toString() }}
            options={TABS.map((t, index) => ({ value: index, name: t.name, id: t.name }))}
            onChange={(value) => setTab(value)}
          />
        </div>

        <div className="hidden md:block w-full">
          <div className="border-b border-gray-200 w-full bg-white shadow rounded-lg">
            <div className="flex -mb-px flex justify-around space-x-2" aria-label="Tabs">
              {tabs.map((t, index) => (
                <div
                  key={t.name}
                  onClick={() => setTab(index)}
                  className={classNames(
                    index === tab
                      ? "border-orange-700 text-gray-800"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "flex justify-center flex-1 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium cursor-pointer max-w-[20rem]"
                  )}
                  aria-current={index === tab ? "page" : undefined}
                >
                  <t.icon
                    className={classNames(
                      index === tab
                        ? "text-gray-700"
                        : "text-gray-400 group-hover:text-gray-500",
                      "-ml-0.5 mr-2 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{t.name}</span>

                  {t.count !== undefined && (
                    <Chip
                      value={t.count}
                      size="sm"
                      variant="ghost"
                      color="blue-gray"
                      className={classNames(
                        "ml-1 rounded-lg transition-all !opacity-75 group-hover:!opacity-100",
                        index === tab ? "text-gray-800" : "text-gray-500"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <ReservationsContext.Provider
        value={{
          sales,
          tables,
          products,
          categories,
          setSales,
          onRefresh: handleRefresh,
          onStart: handleStartReservation,
          onAccept: handleAcceptReservation,
          onReject: handleRejectReservation,
          onCancel: handleCancelReservation,
          onRetire: handleRetireReservation,
        }}
      >
        {/* Historic reservations */}
        <div className={classNames(tab !== 0 && "hidden")}>
          <div
            className="flex items-center group cursor-pointer gap-2 w-48 ml-4 mb-4"
            title={mode === HistoricMode.RESERVATIONS ? "Buscar venta" : "Buscar reserva"}
            data-te-toggle="tooltip"
            onClick={handleModeChange}
          >
            <ArrowsRightLeftIcon className="w-7 h-7 text-gray-500 group-hover:text-gray-800" />

            <p className="text-lg font-semibold text-gray-500 group-hover:text-gray-800">
              {mode === HistoricMode.RESERVATIONS ? "Buscar venta" : "Buscar reserva"}
            </p>
          </div>

          {mode === HistoricMode.RESERVATIONS && (
            <HistoricReservations
              reservations={historic}
              page={page}
              status={status}
              endTime={endTime}
              fullname={fullname}
              startTime={startTime}
              identityDocument={identityDocument}
              totalItems={totalHistoric}
              itemsPerPage={PAGE_SIZE}
              setPage={setPage}
              setStatus={setStatus}
              setEndTime={setEndTime}
              setFullname={setFullname}
              setStartTime={setStartTime}
              setIdentityDocument={setIdentityDocument}
            />
          )}

          {mode === HistoricMode.SALES && (
            <HistoricSales
              sales={historicSales}
              page={page}
              endTime={endTime}
              status={saleStatus}
              fullname={fullname}
              startTime={startTime}
              identityDocument={identityDocument}
              totalItems={totalHistoric}
              itemsPerPage={PAGE_SIZE}
              setPage={setPage}
              setEndTime={setEndTime}
              setStatus={setSaleStatus}
              setFullname={setFullname}
              setStartTime={setStartTime}
              setIdentityDocument={setIdentityDocument}
            />
          )}
        </div>

        {/* Sales */}
        <div className={classNames(tab !== 1 && "hidden")}>
          <OngoingSales reservations={started} />
        </div>

        {/* Accepted reservations */}
        <div className={classNames(tab !== 2 && "hidden")}>
          <AcceptedReservations reservations={accepted} />
        </div>

        {/* Pending reservations */}
        <div className={classNames(tab !== 3 && "hidden")}>
          <PendingReservations reservations={pending} />
        </div>
      </ReservationsContext.Provider>
    </BusinessMainPage>
  );
};

export default Reservations;
