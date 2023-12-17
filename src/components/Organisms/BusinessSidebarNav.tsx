import { FC, useState } from "react";
import classNames from "classnames";
import { Modal } from "../Atoms/Modal";
import { BranchInterface } from "@objects";
import { authLogout } from "src/store/slices/auth";
import logo from "../../assets/images/pa-ca-icon.png";
import { unsetBusiness } from "src/store/slices/business";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import { setBranchSelected, unsetBranches } from "src/store/slices/branches";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Card,
  List,
  Chip,
  ListItem,
  Accordion,
  Typography,
  AccordionBody,
  ListItemPrefix,
  ListItemSuffix,
  AccordionHeader,
} from "@material-tailwind/react";
import {
  PowerIcon,
  TicketIcon,
  UserCircleIcon,
  InboxStackIcon,
  BuildingStorefrontIcon,
  PresentationChartLineIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";

export const BusinessSidebarNav: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const branches = useAppSelector((state) => state.branches.list);
  const branch = useAppSelector((state) => state.branches.selected);

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(authLogout());
    dispatch(unsetBusiness());
    dispatch(unsetBranches());
  };

  const handleBranchChange = (branch: BranchInterface) => {
    dispatch(setBranchSelected(branch));
  };

  return (
    <Card
      className="transition-all z-10 ease-in-out duration-500 group fixed top-0 bottom-0 left-0 w-12 sm:w-20 hover:w-[13rem] hover:sm:w-[20rem] max-w-[20rem] p-2 shadow-xl shadow-blue-gray-900/5 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={classNames(
          "flex items-center mb-2 sm:p-4 gap-4 cursor-pointer",
          !hovered && "pointer-events-none"
        )}
        onClick={() => navigate("/business")}
      >
        <img src={logo} alt="Pa'ca logo" width="30" height="30" />

        <p className="transition-all opacity-0 group-hover:opacity-100 text-xl text-gray-900 font-bold">
          Pa'ca
        </p>
      </div>

      <List
        className={classNames(
          "h-full !min-w-0 text-gray-800 p-0 sm:p-2",
          !hovered && "pointer-events-none"
        )}
      >
        <ListItem
          className="min-h-[3rem] px-1 sm:px-3"
          selected={location.pathname === "/business"}
          onClick={() => navigate("/business")}
        >
          <ListItemPrefix>
            <PresentationChartLineIcon className="h-5 w-5" />
          </ListItemPrefix>
          <p className="transition-all opacity-0 group-hover:opacity-100 truncate">
            Dashboard
          </p>
        </ListItem>

        <Accordion
          open={open}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              } transition-all opacity-0 group-hover:opacity-100`}
            />
          }
        >
          <ListItem className="p-0 min-h-[3rem] px-1 sm:px-3">
            <AccordionHeader onClick={() => setOpen(!open)} className="border-b-0">
              <ListItemPrefix>
                <BuildingStorefrontIcon className="h-5 w-5 text-gray-800" />
              </ListItemPrefix>

              <Typography className="text-gray-800 transition-all opacity-0 group-hover:opacity-100 mr-auto font-normal truncate">
                {branch?.name}
              </Typography>
            </AccordionHeader>
          </ListItem>

          <AccordionBody className="py-1">
            <List className="p-0 !min-w-0 max-h-[9.5rem] overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
              {branches.map((b) => (
                <ListItem
                  key={b.id}
                  className="min-h-[3rem] px-1 sm:px-3"
                  selected={branch?.id === b.id}
                  onClick={() => handleBranchChange(b)}
                >
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>

                  <div className="transition-all overflow-hidden opacity-0 group-hover:opacity-100">
                    <p className="transition-all opacity-0 group-hover:opacity-100 truncate w-[14rem]">
                      {b.name}
                    </p>
                    <p className="transition-all opacity-0 group-hover:opacity-100 truncate text-xs w-[14rem]">
                      {b.location}
                    </p>
                  </div>
                </ListItem>
              ))}
            </List>
          </AccordionBody>
        </Accordion>

        <hr className="my-2 border-blue-gray-50" />

        <ListItem
          className="min-h-[3rem] px-1 sm:px-3"
          onClick={() => navigate("/business/reserves")}
          selected={location.pathname === "/business/reserves"}
        >
          <ListItemPrefix>
            <ClipboardDocumentCheckIcon className="h-5 w-5" />
          </ListItemPrefix>

          <p className="transition-all opacity-0 group-hover:opacity-100">Reservas</p>

          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full transition-all opacity-0 group-hover:opacity-100"
            />
          </ListItemSuffix>
        </ListItem>

        <ListItem
          className="min-h-[3rem] px-1 sm:px-3"
          onClick={() => navigate("/business/products")}
          selected={location.pathname === "/business/products"}
        >
          <ListItemPrefix>
            <InboxStackIcon className="h-5 w-5" />
          </ListItemPrefix>

          <p className="transition-all opacity-0 group-hover:opacity-100">Productos</p>
        </ListItem>

        <ListItem
          className="min-h-[3rem] px-1 sm:px-3"
          onClick={() => navigate("/business/coupons")}
          selected={location.pathname === "/business/coupons"}
        >
          <ListItemPrefix>
            <TicketIcon className="h-5 w-5" />
          </ListItemPrefix>

          <p className="transition-all opacity-0 group-hover:opacity-100">Cupones</p>
        </ListItem>

        <div className="flex flex-col h-full justify-end gap-1">
          <ListItem
            className="min-h-[3rem] px-1 sm:px-3"
            onClick={() => navigate("/business/profile")}
            selected={location.pathname === "/business/profile"}
          >
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>

            <p className="transition-all opacity-0 group-hover:opacity-100">Perfil</p>
          </ListItem>

          <ListItem
            selected={false}
            className="min-h-[3rem] px-1 sm:px-3"
            onClick={() => setOpenLogoutModal(true)}
          >
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>

            <p className="transition-all opacity-0 group-hover:opacity-100 truncate">
              Cerrar Sesión
            </p>
          </ListItem>
        </div>
      </List>

      <Modal open={openLogoutModal} setOpen={setOpenLogoutModal}>
        <p className="text-xl font-light mb-4">Cerrar Sesión</p>

        <p className="mb-4">¿Estás seguro que deseas salir?</p>

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenLogoutModal(false)}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton onClick={handleLogout} type="submit" className="w-full sm:w-40">
            Cerrar Sesión
          </PrimaryButton>
        </div>
      </Modal>
    </Card>
  );
};
