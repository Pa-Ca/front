import { FC, useEffect, useMemo, useState } from "react";
import { useFetch } from "@hooks";
import ReactCardFlip from "react-card-flip";
import { Switch } from "../FormInputs/Switch";
import { useAppSelector } from "src/store/hooks";
import { FormText } from "../FormInputs/FormText";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import { SaleInterface, TableInterace } from "@objects";
import { PaginationFooter } from "../Molecules/PaginationFooter";
import {
  addBranchTable,
  alertService,
  deleteBranchTable,
  getBranchSales,
  getBranchTables,
} from "@services";
import { Modal } from "../Atoms/Modal";
import { IconButton } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";

const TABLES_PER_PAGE = 24;

interface TableCardProps {
  table: TableInterace;
  sales: SaleInterface[];
  onDelete?: () => void;
}
const TableCard: FC<TableCardProps> = ({ table, sales, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const tableSales = useMemo(
    () => sales.filter((sale) => sale.tables.some((t) => t.id === table.id)).length,
    [sales, table.id]
  );

  return (
    <div
      className="cursor-pointer w-full sm:w-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div className="flex flex-col items-center justify-center w-full sm:w-48 h-48 bg-orange-700 shadow-lg rounded-lg cursor-pointer">
          <p className="text-white font-bold text-2xl">{table.name}</p>
        </div>

        <div className="relative flex flex-col border-2 items-center justify-center w-full sm:w-48 h-48 shadow-lg rounded-lg cursor-pointer p-4">
          <p className="font-light text-xl">
            Mesa <span className="font-medium text-gray-800">{table.name}</span>
          </p>
          <p className="font-light text-lg">
            Ventas activas:{" "}
            <span className="font-medium text-gray-800">{tableSales}</span>
          </p>

          <div className="absolute top-4 right-4">
            <IconButton
              variant="text"
              color="red"
              size="sm"
              disabled={tableSales > 0}
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteModal(true);
              }}
            >
              <TrashIcon className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </ReactCardFlip>

      <Modal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <p className="text-xl font-light mb-4">Eliminar mesa</p>

        <p className="mb-4">
          ¿Estás seguro que deseas eliminar la mesa{" "}
          <span className="font-medium italic text-gray-800">{table.name}</span>?
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
            onClick={() => onDelete?.()}
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
