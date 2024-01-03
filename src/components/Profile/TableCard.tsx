import { FC, useMemo, useState } from "react";
import { Modal } from "../Atoms/Modal";
import ReactCardFlip from "react-card-flip";
import { IconButton } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { SaleInterface, SaleStatus, TableInterace } from "@objects";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";

interface TableCardProps {
  table: TableInterace;
  sales: SaleInterface[];
  onDelete?: () => void;
}
export const TableCard: FC<TableCardProps> = ({ table, sales, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const tableSales = useMemo(
    () =>
      sales.filter(
        (sale) =>
          sale.sale.status === SaleStatus.ONGOING &&
          sale.tables.some((t) => t.id === table.id)
      ).length,
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
            Eliminar
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
