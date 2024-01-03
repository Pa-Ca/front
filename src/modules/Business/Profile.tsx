import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { useAppSelector } from "src/store/hooks";
import {
  alertService,
  getBusinessProfileImage,
  updateBusinessProfileImage,
} from "@services";
import {
  Modal,
  FormFile,
  BranchData,
  FormSelect,
  AccountData,
  SecondaryButton,
  BranchTablesData,
  BusinessMainPage,
  PrimaryButton,
} from "@components";
import {
  UserIcon,
  PencilIcon,
  ComputerDesktopIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/20/solid";

const TABS = [
  { name: "Mi Cuenta", icon: UserIcon },
  { name: "Sucursal", icon: BuildingStorefrontIcon },
  { name: "Mesas", icon: ComputerDesktopIcon },
];

const Profile: FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const business = useAppSelector((state) => state.business.data);

  const [tab, setTab] = useState(0);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File>();
  const [profileImage, setProfileImage] = useState<File>();
  const [openUpdateImageModal, setOpenUpdateImageModal] = useState(false);

  const handleSelectImage = (file?: File) => {
    if (!file) {
      setError("");
      setFile(undefined);
      return;
    }

    // Verify if the file is an image
    if (!file.type.startsWith("image")) {
      setError("El archivo seleccionado no es una imagen.");
      return;
    }

    // Verify if the file is too big
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo seleccionado es demasiado grande.");
      return;
    }

    setError("");
    setFile(file);
  };

  const handleUpdateProfileImage = () => {
    if (!business?.id) return;

    updateBusinessProfileImage(business.id, file).then((response) => {
      if (response.isError) {
        alertService.error(
          "No se pudo actualizar la imagen",
          response.error?.message ?? response.exception?.message,
          { autoClose: false }
        );
        return;
      }

      setFile(undefined);
      setProfileImage(file);
      setOpenUpdateImageModal(false);
    });
  };

  useEffect(() => {
    if (!business?.id) return;

    getBusinessProfileImage(business.id).then((response) => {
      if (response.isError || !response.data) return;

      setProfileImage(response.data.image);
    });
  }, [business?.id]);

  useEffect(() => {
    document.title = "Perfil - Pa'ca";
  }, []);

  return (
    <BusinessMainPage>
      {/* Header */}
      <div className="flex flex-col w-full items-center">
        <div
          onClick={() => setOpenUpdateImageModal(true)}
          className="flex items-center justify-center relative cursor-pointer"
        >
          <div className="flex overflow-hidden items-center justify-center rounded-full h-32 w-32 border-4 border-orange-700">
            {!!profileImage && (
              <img
                src={URL.createObjectURL(profileImage)}
                className="h-full w-full"
                id="profile-image"
                alt="Imagen de perfil"
              />
            )}
            {!profileImage && <UserIcon className="h-32 w-32 text-gray-400" />}
          </div>

          <div className="absolute rounded-full bg-orange-700 bottom-0 right-0 p-2">
            <PencilIcon className="h-5 w-5 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">{business?.name}</h1>
        <p className="text-gray-800">{auth.user?.email}</p>
      </div>

      {/* Navigation */}
      <div className="mt-8">
        <div className="sm:hidden">
          <FormSelect
            id="tabs"
            name="tabs"
            label=""
            selected={{ value: tab, name: TABS[tab].name, id: tab.toString() }}
            options={TABS.map((t, index) => ({ value: index, name: t.name, id: t.name }))}
            onChange={(value) => setTab(value)}
          />
        </div>

        <div className="hidden sm:block w-full">
          <div className="border-b border-gray-200 w-full bg-white shadow rounded-lg">
            <div className="flex -mb-px flex justify-around space-x-2" aria-label="Tabs">
              {TABS.map((t, index) => (
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mt-8 shadow bg-white p-3 sm:p-6 rounded-lg mb-8">
        {/* Account data */}
        {tab === 0 && <AccountData />}

        {/* Branch data */}
        {tab === 1 && <BranchData />}

        {/* Branch tables data */}
        {tab === 2 && <BranchTablesData />}
      </div>

      <Modal
        open={openUpdateImageModal}
        setOpen={() => setOpenUpdateImageModal(false)}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <FormFile
          error={error}
          selected={file}
          id="profile-image-file"
          name="profile-image-file"
          label="Por favor seleccione la imagen que desea subir."
          description="Archivos admitidos: .jpg, .jpeg, .png, .gif, .svg. Tamaño máximo: 5MB."
          onSelectFile={handleSelectImage}
        />

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenUpdateImageModal(false)}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton
            onClick={handleUpdateProfileImage}
            type="submit"
            className="w-full sm:w-40"
          >
            Aceptar
          </PrimaryButton>
        </div>
      </Modal>
    </BusinessMainPage>
  );
};

export default Profile;
