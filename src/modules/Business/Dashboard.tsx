import { FC, useEffect, useState } from "react";
import { useFetch } from "@hooks";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/store/hooks";
import { getBranchReservesStats } from "@services";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import {
  LinkText,
  FormSelect,
  BusinessMainPage,
  BranchSalesChart,
  BranchProductsChart,
} from "@components";

const PERIODS = [
  { value: 7, name: "Últimos 7 días", id: "7" },
  { value: 15, name: "Últimos 15 días", id: "15" },
  { value: 30, name: "Últimos 30 días", id: "30" },
];

const Dashboard: FC = () => {
  const fetch = useFetch();
  const navigate = useNavigate();
  const branch = useAppSelector((state) => state.branches.selected);

  const [period, setPeriod] = useState(PERIODS[0]);
  const [barColor, setBarColor] = useState("#ED8936");
  const [branchReservesStats, setBranchReservesStats] = useState({
    active: 0,
    pending: 0,
    approved: 0,
    percentageFull: 0,
  });

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchReservesStats(branch?.id, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          return;
        }

        setBranchReservesStats(response.data);
      }
    );
  }, [branch?.id, fetch]);

  useEffect(() => {
    document.title = "Dashboard - Pa'ca";
  }, []);

  return (
    <BusinessMainPage>
      {/* Header */}
      <div className="flex flex-col w-full gap-2 mb-4">
        <h1 className="text-[2rem] font-bold text-gray-800 leading-none">Dashboard</h1>
        <p className="text-2xl font-light leading-none">
          Estadisticas de la sucursal <br className="md:hidden" />
          <span className="font-medium italic">{branch?.name}</span>
        </p>
        <hr />
      </div>

      <div className="flex flex-1 flex-col md:flex-row items-center gap-16 md:gap-8">
        <div className="flex flex-1 flex-col items-center h-full mt-8 md:mt-0">
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            Porcentaje del local lleno
          </h3>

          <div className="flex flex-1 flex-col justify-center items-center">
            <div className="relative w-[16rem] h-[16rem] sm:w-[20rem] sm:h-[20rem] md:w-[16rem] md:h-[16rem] lg:w-[19rem] lg:h-[19rem] xl:w-[22rem] xl:h-[22rem] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  barSize={40}
                  innerRadius="80%"
                  outerRadius="80%"
                  data={[
                    {
                      value: branchReservesStats.percentageFull,
                      fill: barColor,
                    },
                    {
                      value: 100,
                      fill: "transparent",
                    },
                  ]}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    onMouseEnter={() => setBarColor("#ff963f")}
                    onMouseLeave={() => setBarColor("#ED8936")}
                  />
                </RadialBarChart>
              </ResponsiveContainer>

              <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                <p className="text-5xl sm:text-6xl font-bold text-gray-800 -mt-4">
                  {branchReservesStats.percentageFull.toFixed(0)}%
                </p>
                <LinkText
                  className="text-lg"
                  text="Ver reservas"
                  onClick={() => navigate("/business/reserves")}
                />
              </div>
            </div>

            <div className="flex w-full items-center justify-evenly mt-4 sm:gap-12 sm:px-8 md:gap-2 md:px-0 xl:gap-12 xl:px-8">
              <div className="flex flex-1 flex-col items-center">
                <p className="sm:text-lg md:text-md lg:text-lg font-normal text-gray-800 text-center leading-tight">
                  Reservas
                  <br />
                  Pendientes
                </p>
                <p className="text-3xl sm:text-5xl md:text-3xl lg:text-5xl font-medium text-gray-800">
                  {branchReservesStats.pending}
                </p>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <p className="sm:text-lg md:text-md lg:text-lg font-normal text-gray-800 text-center leading-tight">
                  Reservas
                  <br />
                  Aprobadas
                </p>
                <p className="text-3xl sm:text-5xl md:text-3xl lg:text-5xl font-medium text-gray-800">
                  {branchReservesStats.approved}
                </p>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <p className="sm:text-lg md:text-md lg:text-lg font-normal text-gray-800 text-center leading-tight">
                  Reservas
                  <br />
                  Activas
                </p>
                <p className="text-3xl sm:text-5xl md:text-3xl lg:text-5xl font-medium text-gray-800">
                  {branchReservesStats.active}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-[2.3] w-full h-full gap-16 md:gap-8">
          <div className="w-full">
            <h3 className="text-center md:text-left text-2xl font-bold text-gray-800">
              Ganancias diarias
            </h3>
            <BranchSalesChart />
          </div>

          <div className="flex flex-col md:flex-row overflow-hidden gap-2">
            <div className="flex-[1.5]">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mb-4">
                <h3 className="text-2xl font-bold text-center sm:text-left text-gray-800">
                  <LinkText
                    text="Productos"
                    className="text-2xl font-bold"
                    onClick={() => navigate("/business/products")}
                  />{" "}
                  más vendidos
                </h3>

                <div className="w-full sm:w-48">
                  <FormSelect
                    label=""
                    id="branches"
                    name="branches"
                    selected={period}
                    options={PERIODS}
                    onChange={(p) => setPeriod(PERIODS.find((item) => item.value === p)!)}
                  />
                </div>
              </div>
              <BranchProductsChart period={period.value} />
            </div>

            <div className="flex-1 md:hidden xl:block"></div>
          </div>
        </div>
      </div>
    </BusinessMainPage>
  );
};

export default Dashboard;
