import { FC, useEffect, useMemo, useState } from "react";
import { useFetch } from "@hooks";
import { Modal } from "../Atoms/Modal";
import { TableCard } from "./TableCard";
import { Switch } from "../FormInputs/Switch";
import { useAppSelector } from "src/store/hooks";
import { FormText } from "../FormInputs/FormText";
import { SaleInterface, TableInterace } from "@objects";
import { PaginationFooter } from "../Molecules/PaginationFooter";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import defaultImage from "../../assets/images/default-product-image-without-bg.png";
import {
  alertService,
  addBranchTable,
  getBranchSales,
  getBranchTables,
  deleteBranchTable,
} from "@services";

const TABLES_PER_PAGE = 24;

export const BranchTablesData: FC = () => {
  const fetch = useFetch();
  const branch = useAppSelector((state) => state.branches.selected);

  const [newTable, setNewTable] = useState("");
  const [tablePage, setTablePage] = useState(0);
  const [tableSearch, setTableSearch] = useState("");
  const [activeSales, setActiveSales] = useState(false);
  const [sales, setSales] = useState<SaleInterface[]>([]);
  const [tables, setTables] = useState<TableInterace[]>([]);
  const [openCreationModal, setOpenCreationModal] = useState(false);

  const filteredTables = useMemo(() => {
    setTablePage(0);

    return tables
      .filter(
        (table) =>
          (!tableSearch ||
            table.name.toLowerCase().includes(tableSearch.toLowerCase())) &&
          (!activeSales ||
            sales.some((sale) => sale.tables.some((t) => t.id === table.id)))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tableSearch, activeSales, tables]);

  const paginatedTables = useMemo(() => {
    const start = tablePage * TABLES_PER_PAGE;
    const end = start + TABLES_PER_PAGE;

    return filteredTables.slice(start, end);
  }, [tablePage, filteredTables]);

  const handleCreateTable = () => {
    if (!newTable) return;

    const table: TableInterace = {
      id: 0,
      name: newTable,
      branchId: branch?.id!,
    };

    fetch((token: string) => addBranchTable(table, token)).then((response) => {
      if (response.isError || !response.data) {
        alertService.error(
          "No se pudo crear la mesa",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      setNewTable("");
      setOpenCreationModal(false);
      setTables([...tables, response.data]);
    });
  };

  const handleDeleteTable = (table: TableInterace) => {
    fetch((token: string) => deleteBranchTable(table.id, token)).then((response) => {
      if (response.isError) {
        alertService.error(
          "No se pudo eliminar la mesa",
          response.error?.message ?? response.exception?.message
        );
        return;
      }

      setTables(tables.filter((t) => t.id !== table.id));
    });
  };

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
  }, [branch?.id]);

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchSales(branch.id, token, tables)).then(
      (response) => {
        if (response.isError || !response.data) {
          alertService.error(
            "Error al obtener ventas",
            response.error?.message ?? response.exception?.message,
            { autoClose: false }
          );
          return;
        }

        setSales(response.data.ongoingSalesInfo);
      }
    );
  }, [branch?.id, tables]);

  return (
    <div className="flex flex-col w-full gap-6 text-lg sm:gap-2 text-sm sm:text-md">
      {!!branch && (
        <>
          <p className="text-lg font-light">
            Detalles de las mesas de{" "}
            <span className="italic font-medium text-gray-700">{branch?.name}</span>
          </p>

          <div className="flex flex-1 flex-col md:flex-row md:items-center gap-2 md:gap-8 justify-between mt-2">
            <FormText
              label=""
              id="tableSearch"
              name="tableSearch"
              autoComplete="off"
              value={tableSearch}
              placeholder="Buscar mesa..."
              containerClassName="flex-1"
              onChange={(e) => setTableSearch(e.target.value)}
            />

            <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center sm:gap-8 justify-between">
              <div className="flex flex-col gap-1 text-sm items-center">
                Con ventas activas
                <Switch checked={activeSales} onChange={setActiveSales} />
              </div>

              <PrimaryButton
                className="w-full sm:w-40"
                onClick={() => setOpenCreationModal(true)}
              >
                Crear Mesa
              </PrimaryButton>
            </div>
          </div>

          <div className="flex flex-col items-center sm:flex-row flex-wrap gap-4 sm:gap-6 mt-8 sm:justify-evenly mb-6">
            {paginatedTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                sales={sales}
                onDelete={() => handleDeleteTable(table)}
              />
            ))}
          </div>

          <PaginationFooter
            currentPage={tablePage}
            totalItems={filteredTables.length}
            itemsPerPage={TABLES_PER_PAGE}
            onPageChange={setTablePage}
          />
        </>
      )}

      {!branch && (
        <div className="flex flex-1 flex-col items-center justify-center">
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
        open={openCreationModal}
        setOpen={setOpenCreationModal}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <p className="text-xl font-light mb-4">Crear nueva mesa</p>

        <FormText
          label=""
          id="newTable"
          name="newTable"
          maxLength={4}
          autoComplete="off"
          value={newTable}
          placeholder="XXXX"
          containerClassName="flex-1"
          onChange={(e) => setNewTable(e.target.value)}
        />

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenCreationModal(false)}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton
            onClick={handleCreateTable}
            type="submit"
            className="w-full sm:w-40"
          >
            Aceptar
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
