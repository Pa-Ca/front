import { FC, useEffect } from "react";
import { BusinessMainPage } from "@components";

const Coupons: FC = () => {
  useEffect(() => {
    document.title = "Cupones - Pa'ca";
  }, []);

  return (
    <BusinessMainPage>
      {/* Header */}
      <div className="flex flex-col w-full gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Cupones</h1>
      </div>
    </BusinessMainPage>
  );
};

export default Coupons;
