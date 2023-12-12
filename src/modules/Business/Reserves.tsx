import { FC, useEffect } from "react";
import { BusinessMainPage } from "@components";

const Reserves: FC = () => {
  useEffect(() => {
    document.title = "Reservas - Pa'ca";
  }, []);

  return (
    <BusinessMainPage>
      {/* Header */}
      <div className="flex flex-col w-full gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>
      </div>
    </BusinessMainPage>
  );
};

export default Reserves;
