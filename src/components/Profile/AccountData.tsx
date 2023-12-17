import { FC, useState } from "react";
import { useFetch } from "@hooks";
import { formatTier } from "@utils";
import { Modal } from "../Atoms/Modal";
import { FormikHelpers } from "formik";
import { updateBusiness, updatePassword } from "@services";
import { setBusiness } from "src/store/slices/business";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import { EditAccountForm, EditAccountFormValues } from "./EditAccountForm";
import { EditPasswordForm, EditPasswordFormValues } from "./EditPasswordForm";

export const AccountData: FC = () => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const business = useAppSelector((state) => state.business.data);

  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const handleEditProfile = async (
    values: EditAccountFormValues,
    formik: FormikHelpers<EditAccountFormValues>
  ) => {
    const response = await fetch((token: string) => updateBusiness(values, token));

    if (response.isError) {
      formik.setFieldError("name", response.exception?.message);
      return;
    }

    setEditProfile(false);
    dispatch(
      setBusiness({
        ...business!,
        name: values.name,
        phoneNumber: values.phoneNumber!,
      })
    );
  };

  const handleEditPassword = async (
    values: EditPasswordFormValues,
    formik: FormikHelpers<EditPasswordFormValues>
  ) => {
    if (!auth.user?.email) return;

    const response = await updatePassword(
      auth.user.email,
      values.oldPassword,
      values.newPassword
    );

    if (response.isError) {
      formik.setFieldError("newPassword", response.exception?.message);
      return;
    }

    setEditPassword(false);
  };

  return (
    <div className="flex flex-col w-full gap-6 text-lg sm:gap-2 text-sm sm:text-md">
      <p className="text-lg font-light">Detalles de la cuenta</p>

      <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
        <p className="text-gray-800 font-light w-20">Nombre:</p>
        <p className="text-gray-800">{business?.name}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
        <p className="text-gray-800 font-light w-20">Correo:</p>
        <p className="text-gray-800">
          {auth.user?.email}{" "}
          <span className="italic font-light">
            {!auth.user?.verified && "(No verificado)"}
          </span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
        <p className="text-gray-800 font-light w-20">Celular:</p>
        <p className="text-gray-800">{business?.phoneNumber}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
        <p className="text-gray-800 font-light w-20">Plan:</p>
        <p className="text-gray-800">{formatTier(business?.tier)}</p>
      </div>

      <div className="flex w-full flex-col sm:flex-row gap-4 justify-between mt-8">
        <PrimaryButton className="w-full sm:w-40" onClick={() => setEditProfile(true)}>
          Editar Perfil
        </PrimaryButton>

        <SecondaryButton className="w-full sm:w-40" onClick={() => setEditPassword(true)}>
          Editar Contraseña
        </SecondaryButton>
      </div>

      {!!business && (
        <Modal
          open={editProfile}
          setOpen={setEditProfile}
          className="w-full m-8 max-w-[30rem]"
        >
          <p className="text-xl font-light mb-4">Editar perfil</p>

          <EditAccountForm
            onSubmit={handleEditProfile}
            initialValues={{ name: business.name, phoneNumber: business.phoneNumber }}
          />

          <SecondaryButton className="w-full mt-4" onClick={() => setEditProfile(false)}>
            Cancelar
          </SecondaryButton>
        </Modal>

      )}

      <Modal
        open={editPassword}
        setOpen={setEditPassword}
        className="w-full m-8 max-w-[30rem]"
      >
        <p className="text-xl font-light mb-4">Editar contraseña</p>

        <EditPasswordForm onSubmit={handleEditPassword} />

        <SecondaryButton className="w-full mt-4" onClick={() => setEditProfile(false)}>
          Cancelar
        </SecondaryButton>
      </Modal>
    </div>
  );
};
