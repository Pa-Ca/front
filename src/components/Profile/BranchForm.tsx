import { FC } from "react";
import * as Yup from "yup";
import { Switch } from "../FormInputs/Switch";
import { Duration, LocalTime } from "@objects";
import { FormText } from "../FormInputs/FormText";
import { FormSearch } from "../FormInputs/FormSearch";
import { FormDuration } from "../FormInputs/FormDuration";
import { FormTextArea } from "../FormInputs/FormTextArea";
import { FormLocalTime } from "../FormInputs/FormLocalTime";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import {
  BRANCH_TYPES,
  BRANCH_LOCATIONS,
  handleNumberChange,
  handleIntegerChange,
} from "@utils";

export interface BranchFormValues {
  name: string;
  type: string;
  phoneNumber: string;
  location: string;
  capacity: string;
  averageReserveTime: Duration;
  reservationPrice: string;
  hourIn: LocalTime;
  hourOut: LocalTime;
  overview: string;
  mapsLink: string;
  visibility: boolean;
  reserveOff: boolean;
}
interface FormInterface {
  formik: FormikProps<BranchFormValues>;
  onCancel?: () => void;
}
const Form: FC<FormInterface> = ({ formik, onCancel }) => {
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-2"
      autoComplete="off"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormText
            required
            id="name"
            name="name"
            autoComplete="nope"
            label="Nombre"
            value={formik.values.name}
            error={
              formik.touched.name && formik.errors.name ? formik.errors.name : undefined
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            containerClassName="flex flex-1 flex-col"
          />

          <FormSearch
            required
            id="type"
            name="type"
            label="Tipo"
            selected={{
              value: formik.values.type,
              name: formik.values.type,
              id: formik.values.type,
            }}
            error={
              formik.touched.type && formik.errors.type ? formik.errors.type : undefined
            }
            options={BRANCH_TYPES.map((type) => ({
              value: type,
              name: type,
              id: type,
            }))}
            onSelectOption={(value) => formik.setFieldValue("type", value)}
            containerClassName="flex flex-1 flex-col"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormText
            required
            id="phoneNumber"
            name="phoneNumber"
            autoComplete="nope"
            label="Celular"
            value={formik.values.phoneNumber}
            error={
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? formik.errors.phoneNumber
                : undefined
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            containerClassName="flex-1"
          />

          <FormSearch
            required
            id="location"
            name="location"
            label="Ubicación"
            selected={{
              value: formik.values.location,
              name: formik.values.location,
              id: formik.values.location,
            }}
            error={
              formik.touched.location && formik.errors.location
                ? formik.errors.location
                : undefined
            }
            options={BRANCH_LOCATIONS.map((location) => ({
              value: location,
              name: location,
              id: location,
            }))}
            onSelectOption={(value) => formik.setFieldValue("location", value)}
            containerClassName="flex flex-1 flex-col"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormText
            required
            id="capacity"
            name="capacity"
            autoComplete="off"
            label="Capacidad"
            value={formik.values.capacity}
            error={
              formik.touched.capacity && formik.errors.capacity
                ? formik.errors.capacity
                : undefined
            }
            onBlur={formik.handleBlur}
            onChange={(e) => handleIntegerChange(e, formik.handleChange, 0)}
            containerClassName="flex-1"
          />

          <FormDuration
            required
            id="averageReserveTime"
            name="averageReserveTime"
            label="Tiempo promedio de reserva"
            value={formik.values.averageReserveTime}
            error={
              formik.touched.averageReserveTime && formik.errors.averageReserveTime
                ? formik.errors.averageReserveTime
                : undefined
            }
            onChange={(e) => formik.setFieldValue("averageReserveTime", e)}
            containerClassName="flex-1"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormText
            required
            id="reservationPrice"
            name="reservationPrice"
            autoComplete="off"
            label="Coste por Persona ($)"
            value={formik.values.reservationPrice}
            error={
              formik.touched.reservationPrice && formik.errors.reservationPrice
                ? formik.errors.reservationPrice
                : undefined
            }
            onBlur={formik.handleBlur}
            onChange={(e) => handleNumberChange(e, formik.handleChange, 0)}
            containerClassName="flex-1"
          />

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
            <FormLocalTime
              required
              id="hourIn"
              name="hourIn"
              label="Hora de apertura"
              value={formik.values.hourIn}
              error={
                formik.touched.hourIn && formik.errors.hourIn
                  ? formik.errors.hourIn
                  : undefined
              }
              onChange={(e) => formik.setFieldValue("hourIn", e)}
              containerClassName="flex-1"
            />

            <FormLocalTime
              required
              id="hourOut"
              name="hourOut"
              label="Hora de cierre"
              value={formik.values.hourOut}
              error={
                formik.touched.hourOut && formik.errors.hourOut
                  ? formik.errors.hourOut
                  : undefined
              }
              onChange={(e) => formik.setFieldValue("hourOut", e)}
              containerClassName="flex-1"
            />
          </div>
        </div>

        <FormTextArea
          id="overview"
          name="overview"
          label="Descripción"
          value={formik.values.overview}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          containerClassName="flex-1"
          className="h-32 resize-none"
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
          <FormText
            id="mapsLink"
            name="mapsLink"
            autoComplete="off"
            label="Link al Google Maps"
            value={formik.values.mapsLink}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            containerClassName="flex-1"
          />

          <div className="flex gap-8">
            <div className="flex flex-col gap-1 text-sm items-center">
              Visible
              <Switch
                checked={formik.values.visibility}
                onChange={(v) => formik.setFieldValue("visibility", v)}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm items-center">
              Acepta reservas
              <Switch
                checked={!formik.values.reserveOff}
                onChange={(v) => formik.setFieldValue("reserveOff", !v)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton type="button" className="w-full sm:w-40" onClick={onCancel}>
            Cancelar
          </SecondaryButton>

          <PrimaryButton type="submit" className="w-full sm:w-40">
            Aceptar
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

interface BranchFormProps {
  initialValues?: BranchFormValues;
  onCancel?: () => void;
  onSubmit?: (prop: BranchFormValues, formik: FormikHelpers<BranchFormValues>) => void;
}
export const BranchForm: FC<BranchFormProps> = ({
  initialValues,
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Este campo es requerido"),
    capacity: Yup.number().required("Este campo es requerido"),
    type: Yup.string().required("Este campo es requerido"),
    phoneNumber: Yup.string().required("Este campo es requerido"),
    location: Yup.string().required("Este campo es requerido"),
    averageReserveTime: Yup.string().required("Este campo es requerido"),
    reservationPrice: Yup.number().required("Este campo es requerido"),
    hourIn: Yup.string().required("Este campo es requerido"),
    hourOut: Yup.string().required("Este campo es requerido"),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          name: "",
          type: "",
          phoneNumber: "",
          location: "",
          capacity: "",
          averageReserveTime: "PT00H00M00S" as Duration,
          reservationPrice: "",
          hourIn: "00:00:00" as LocalTime,
          hourOut: "24:00:00" as LocalTime,
          overview: "",
          mapsLink: "",
          visibility: true,
          reserveOff: false,
        }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => <Form formik={formik} onCancel={onCancel} />}
    </Formik>
  );
};
