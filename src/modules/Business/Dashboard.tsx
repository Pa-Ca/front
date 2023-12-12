import { FC, useEffect } from "react";
import { BusinessMainPage } from "@components";
import { useAppSelector } from "src/store/hooks";

const Dashboard: FC = () => {
  const business = useAppSelector((state) => state.business.data);

  useEffect(() => {
    document.title = "Dashboard - Pa'ca";
  }, []);

  return (
    <BusinessMainPage>
      {/* Header */}
      <div className="flex flex-col w-full gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p>Bienvenido, {business?.name}</p>
      </div>
    </BusinessMainPage>
  );
};

export default Dashboard;
