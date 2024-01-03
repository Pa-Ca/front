import { FC, useMemo } from "react";
import * as Yup from "yup";
import moment from "moment";
import classNames from "classnames";
import { Duration, LocalTime } from "@objects";
import { FormText } from "../FormInputs/FormText";
import { FormDuration } from "../FormInputs/FormDuration";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { FormLocalTime } from "../FormInputs/FormLocalTime";
import { FormDatePicker } from "../FormInputs/FormDatePicker";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";

export interface ReservationFormValues {
  guestName: string;
  guestSurname: string;
  guestEmail: string;
  guestPhoneNumber: string;
  guestIdentityDocument: string;
  reservationDateIn: string;
  reservationHourIn: LocalTime;
  reservationDuration: Duration;
  tableNumber: string;
  clientNumber: string;
  occasion: string;
}
interface FormInterface {
  formik: FormikProps<ReservationFormValues>;
  onCancel?: () => void;
}
const Form: FC<FormInterface> = ({ formik, onCancel }) => {
  const reservationDateInData = useMemo(() => {
    const date = formik.values.reservationDateIn
      ? moment(formik.values.reservationDateIn).toDate()
      : null;

    return {
      startDate: date,
      endDate: date,
    };
  }, [formik.values.reservationDateIn]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-6"
      autoComplete="nope"
    >
      <div className="flex flex-col gap-4">
        <hr />
        <p className="text-xl font-light">Datos del Cliente</p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormText
            required
            id="guestName"
            name="guestName"
            autoComplete="nope"
            label="Nombre"
            value={formik.values.guestName}
            error={
              formik.touched.guestName && formik.errors.guestName
                ? formik.errors.guestName
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-[2] flex-col"
          />

          <FormText
            required
            id="guestSurname"
            name="guestSurname"
            autoComplete="nope"
            label="Apellido"
            value={formik.values.guestSurname}
            error={
              formik.touched.guestSurname && formik.errors.guestSurname
                ? formik.errors.guestSurname
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-[2] flex-col"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormText
            required
            type="email"
            id="guestEmail"
            name="guestEmail"
            autoComplete="nope"
            label="Correo electrónico"
            value={formik.values.guestEmail}
            error={
              formik.touched.guestEmail && formik.errors.guestEmail
                ? formik.errors.guestEmail
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-1 flex-col"
          />

          <div className="flex flex-1 gap-4">
            <FormText
              required
              id="guestPhoneNumber"
              name="guestPhoneNumber"
              autoComplete="nope"
              label="Número de teléfono"
              value={formik.values.guestPhoneNumber}
              error={
                formik.touched.guestPhoneNumber && formik.errors.guestPhoneNumber
                  ? formik.errors.guestPhoneNumber
                  : undefined
              }
              onChange={formik.handleChange}
              containerClassName="flex flex-1 flex-col"
            />

            <FormText
              required
              id="guestIdentityDocument"
              name="guestIdentityDocument"
              autoComplete="nope"
              label="Cédula"
              value={formik.values.guestIdentityDocument}
              error={
                formik.touched.guestIdentityDocument &&
                formik.errors.guestIdentityDocument
                  ? formik.errors.guestIdentityDocument
                  : undefined
              }
              onChange={formik.handleChange}
              containerClassName="flex flex-1 flex-col"
            />
          </div>
        </div>

        <hr />
        <p className="text-xl font-light">Datos de la Reserva</p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormDatePicker
            required
            id="reservationDateIn"
            name="reservationDateIn"
            label="Fecha de reserva"
            useRange={false}
            value={reservationDateInData}
            placeholder="Para la fecha"
            toggleClassName={(oldClassName) =>
              classNames(oldClassName, "text-orange-700")
            }
            onChange={(e) =>
              formik.setFieldValue(
                "reservationDateIn",
                e?.startDate ? moment(e?.startDate).toISOString() : ""
              )
            }
            error={
              formik.touched.reservationDateIn && formik.errors.reservationDateIn
                ? formik.errors.reservationDateIn
                : undefined
            }
            configs={{
              shortcuts: {
                today: "Hoy",
                yesterday: "Ayer",
                currentMonth: "Mes actual",
                pastMonth: "Mes anterior",
                past: (period: number) => `Hace ${period} días`,
              },
            }}
            containerClassName="flex-1"
          />

          <div className="flex flex-1 gap-4">
            <FormLocalTime
              required
              id="reservationHourIn"
              name="reservationHourIn"
              label="Hora de reserva"
              value={formik.values.reservationHourIn}
              error={
                formik.touched.reservationHourIn && formik.errors.reservationHourIn
                  ? formik.errors.reservationHourIn
                  : undefined
              }
              onChange={(e) => formik.setFieldValue("reservationHourIn", e)}
              containerClassName="flex-1"
            />

            <FormDuration
              required
              id="reservationDuration"
              name="reservationDuration"
              label="Duración estimada"
              value={formik.values.reservationDuration}
              error={
                formik.touched.reservationDuration && formik.errors.reservationDuration
                  ? formik.errors.reservationDuration
                  : undefined
              }
              onChange={(e) => formik.setFieldValue("reservationDuration", e)}
              containerClassName="flex-1"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <FormText
            required
            id="tableNumber"
            name="tableNumber"
            autoComplete="nope"
            label="Número de mesas"
            value={formik.values.tableNumber}
            error={
              formik.touched.tableNumber && formik.errors.tableNumber
                ? formik.errors.tableNumber
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-[2] flex-col"
          />

          <FormText
            required
            id="clientNumber"
            name="clientNumber"
            autoComplete="nope"
            label="Número de personas"
            value={formik.values.clientNumber}
            error={
              formik.touched.clientNumber && formik.errors.clientNumber
                ? formik.errors.clientNumber
                : undefined
            }
            onChange={formik.handleChange}
            containerClassName="flex flex-[2] flex-col"
          />
        </div>

        <hr />

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

interface ReservationFormProps {
  onCancel?: () => void;
  onSubmit?: (
    prop: ReservationFormValues,
    formik: FormikHelpers<ReservationFormValues>
  ) => void;
}
export const ReservationForm: FC<ReservationFormProps> = ({
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  // Validations with Yup for Formik form
  const validationSchema = Yup.object().shape({
    guestName: Yup.string().required("Este campo es obligatorio"),
    guestSurname: Yup.string().required("Este campo es obligatorio"),
    guestEmail: Yup.string()
      .email("El correo electrónico no es válido")
      .required("Este campo es obligatorio"),
    guestPhoneNumber: Yup.string().required("Este campo es obligatorio"),
    guestIdentityDocument: Yup.string().required("Este campo es obligatorio"),
    reservationDateIn: Yup.string().required("Este campo es obligatorio"),
    reservationHourIn: Yup.string().required("Este campo es obligatorio"),
    reservationDuration: Yup.string()
      .required("Este campo es obligatorio")
      .test("is-valid-duration", "La duración debe ser al menos 30 minutos", (value) => {
        if (!value) return false;

        const duration = moment.duration(value);
        return duration.asMinutes() >= 30;
      }),
    tableNumber: Yup.string().required("Este campo es obligatorio"),
    clientNumber: Yup.string().required("Este campo es obligatorio"),
  });

  return (
    <Formik
      initialValues={{
        guestName: "",
        guestSurname: "",
        guestEmail: "",
        guestPhoneNumber: "",
        guestIdentityDocument: "",
        reservationDateIn: "",
        reservationHourIn: "00:00:00" as LocalTime,
        reservationDuration: "PT00H00M00S" as Duration,
        tableNumber: "",
        clientNumber: "",
        occasion: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, formik) => {
        onSubmit(values, formik);
      }}
    >
      {(formik) => <Form onCancel={onCancel} formik={formik} />}
    </Formik>
  );
};
