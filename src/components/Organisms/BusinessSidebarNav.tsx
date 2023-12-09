import { FC, useState } from "react";
import classNames from "classnames";
import { useAppDispatch } from "src/store/hooks";
import { authLogout } from "src/store/slices/auth";
import logo from "../../assets/images/pa-ca-icon.png";
import { unsetBusiness } from "src/store/slices/business";
import { useLocation, useNavigate } from "react-router-dom";
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

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLogout = () => {
    dispatch(authLogout());
    dispatch(unsetBusiness());
  };

  return (
    <Card
      className="transition-all ease-in-out duration-500 group fixed top-0 bottom-0 left-0 w-20 hover:w-[20rem] max-w-[20rem] p-2 shadow-xl shadow-blue-gray-900/5 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={classNames(
          "flex items-center mb-2 p-4 gap-4 cursor-pointer",
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
          "h-full !min-w-0 text-gray-800",
          !hovered && "pointer-events-none"
        )}
      >
        <ListItem
          className="min-h-[3rem]"
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
          <ListItem className="p-0 min-h-[3rem]">
            <AccordionHeader onClick={() => setOpen(!open)} className="border-b-0 p-3">
              <ListItemPrefix>
                <BuildingStorefrontIcon className="h-5 w-5 text-gray-800" />
              </ListItemPrefix>

              <Typography className="text-gray-800 transition-all opacity-0 group-hover:opacity-100 mr-auto font-normal truncate">
                Sucursal 3
              </Typography>
            </AccordionHeader>
          </ListItem>

          <AccordionBody className="py-1">
            <List className="p-0 max-h-[9.5rem] overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
              <ListItem className="min-h-[2.5rem]">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>

                <p className="transition-all opacity-0 group-hover:opacity-100 truncate">
                  Sucursal 1
                </p>
              </ListItem>

              <ListItem className="min-h-[2.5rem]">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>

                <p className="transition-all opacity-0 group-hover:opacity-100 truncate">
                  Sucursal 2
                </p>
              </ListItem>

              <ListItem className="min-h-[2.5rem]">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>

                <p className="transition-all opacity-0 group-hover:opacity-100 truncate">
                  Sucursal 3
                </p>
              </ListItem>

              <ListItem className="min-h-[2.5rem]">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>

                <p className="transition-all opacity-0 group-hover:opacity-100 truncate">
                  Sucursal 4
                </p>
              </ListItem>

              <ListItem className="min-h-[2.5rem]">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>

                <p className="transition-all opacity-0 group-hover:opacity-100 truncate">
                  Sucursal 5
                </p>
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>

        <hr className="my-2 border-blue-gray-50" />

        <ListItem
          className="min-h-[3rem]"
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
          className="min-h-[3rem]"
          onClick={() => navigate("/business/products")}
          selected={location.pathname === "/business/products"}
        >
          <ListItemPrefix>
            <InboxStackIcon className="h-5 w-5" />
          </ListItemPrefix>

          <p className="transition-all opacity-0 group-hover:opacity-100">Productos</p>
        </ListItem>

        <div className="flex flex-col h-full justify-end gap-1">
          <ListItem
            className="min-h-[3rem]"
            onClick={() => navigate("/business/profile")}
            selected={location.pathname === "/business/profile"}
          >
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>

            <p className="transition-all opacity-0 group-hover:opacity-100">Perfil</p>
          </ListItem>

          <ListItem selected={false} className="min-h-[3rem]" onClick={handleLogout}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>

            <p className="transition-all opacity-0 group-hover:opacity-100 truncate">
              Cerrar Sesión
            </p>
          </ListItem>
        </div>
      </List>
    </Card>
  );
};
