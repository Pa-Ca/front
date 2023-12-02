import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/pa-ca-icon.png";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const TermsAndConditions: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Términos y Condiciones - Pa'ca";
  }, []);

  return (
    <div className="flex h-screen w-screen md:h-full md:w-full items-center justify-center p-4 sm:p-8 md:p-16">
      <div
        className="flex flex-1 items-stretch gap-8 h-full max-h-128"
        style={{ maxWidth: "60rem" }}
      >
        <div className="flex flex-1 flex-col justify-evenly">
          <div>
            <img src={logo} alt="Pa'ca logo" width="75" height="75" />
            <div
              className="group flex items-center gap-2 mt-2 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <div className="flex p-2 rounded-full bg-orange-50 group-hover:bg-orange-100 items-center justify-center">
                <ChevronLeftIcon className="h-6 w-6 text-orange-700" />
              </div>

              <p className="font-medium">Regresar</p>
            </div>
            <h1
              style={{ fontSize: "2.3rem" }}
              className="font-bold text-start text-gray-900"
            >
              Terms and Conditions
            </h1>
          </div>

          {/* Payments section */}
          <h3 className="text-lg font-semibold">Payments</h3>
          <p>
            If you are purchasing your ticket using a debit or credit card via the
            Website, we will process these payments via the automated secure common
            payment gateway which will be subject to fraud screening purposes.
          </p>
          <br />
          <p>
            If you do not supply the correct card billing address and/or cardholder
            information, your booking will not be confirmed and the overall cost may
            increase. We reserve the right to cancel your booking if payment is declined
            for any reason or if you have supplied incorrect card information. If we
            become aware of, or is notified of, any fraud or illegal activity associated
            with the payment for the booking, the booking will be cancelled and you will
            be liable for all costs and expenses arising from such cancellation, without
            prejudice to any action that may be taken against us.
          </p>
          <br />
          <p>
            Golobe may require the card holder to provide additional payment verification
            upon request by either submitting an online form or visiting the nearest
            Golobe office, or at the airport at the time of check-in. Golobe reserves the
            right to deny boarding or to collect a guarantee payment (in cash or from
            another credit card) if the card originally used for the purchase cannot be
            presented by the cardholder at check-in or when collecting the tickets, or in
            the case the original payment has been withheld or disputed by the card
            issuing bank. Credit card details are held in a secured environment and
            transferred through an internationally accepted system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
