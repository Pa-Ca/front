import { FC, useEffect, useState } from "react";
import { useFetch } from "@hooks";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/store/hooks";
import { BranchSaleStatsInterface } from "@objects";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { getBranchReservationsStats, getBranchSalesStats } from "@services";
import {
  LinkText,
  FormSelect,
  BusinessMainPage,
  BranchSalesChart,
  BranchCouponsChart,
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

  const [barColor, setBarColor] = useState("#ED8936");
  const [couponsPeriod, setCouponsPeriod] = useState(PERIODS[0]);
  const [productsPeriod, setProductsPeriod] = useState(PERIODS[0]);
  const [saleStatsData, setSalesStatsData] = useState<BranchSaleStatsInterface[]>([]);
  const [branchReservationsStats, setBranchReservationsStats] = useState({
    active: 0,
    pending: 0,
    approved: 0,
    percentageFull: 0,
  });

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchReservationsStats(branch?.id, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          return;
        }

        setBranchReservationsStats(response.data);
      }
    );
  }, [branch?.id, fetch]);

  useEffect(() => {
    if (!branch?.id) return;

    fetch((token: string) => getBranchSalesStats(branch?.id, token)).then((response) => {
      if (response.isError || !response.data) {
        return;
      }

      setSalesStatsData(response.data);
    });
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
        {/* Percentage branch full */}
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
                      value: branchReservationsStats.percentageFull,
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
                  {branchReservationsStats.percentageFull.toFixed(0)}%
                </p>
                <LinkText
                  className="text-xl"
                  text="Ver reservas"
                  onClick={() => navigate("/business/reservations")}
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
                  {branchReservationsStats.pending}
                </p>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <p className="sm:text-lg md:text-md lg:text-lg font-normal text-gray-800 text-center leading-tight">
                  Reservas
                  <br />
                  Aprobadas
                </p>
                <p className="text-3xl sm:text-5xl md:text-3xl lg:text-5xl font-medium text-gray-800">
                  {branchReservationsStats.approved}
                </p>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <p className="sm:text-lg md:text-md lg:text-lg font-normal text-gray-800 text-center leading-tight">
                  Reservas
                  <br />
                  Activas
                </p>
                <p className="text-3xl sm:text-5xl md:text-3xl lg:text-5xl font-medium text-gray-800">
                  {branchReservationsStats.active}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-[2.3] w-full h-full gap-16 md:gap-8">
          {/* Sales stats */}
          <div className="w-full md:hidden xl:block">
            <h3 className="text-center md:text-left text-2xl font-bold text-gray-800">
              Ganancias diarias
            </h3>
            <BranchSalesChart data={saleStatsData} />
          </div>

          {/* Products and coupons stats */}
          <div className="flex flex-col xl:flex-row overflow-hidden gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mb-4">
                <h3 className="text-xl font-bold text-center sm:text-left text-gray-800">
                  <LinkText
                    text="Productos"
                    className="text-xl font-bold"
                    onClick={() => navigate("/business/products")}
                  />{" "}
                  más vendidos
                </h3>

                <div className="flex w-full sm:w-48 justify-center sm:justify-end">
                  <FormSelect
                    label=""
                    id="branches"
                    name="branches"
                    selected={productsPeriod}
                    options={PERIODS}
                    onChange={(p) =>
                      setProductsPeriod(PERIODS.find((item) => item.value === p)!)
                    }
                    containerClassName="max-w-[10rem]"
                  />
                </div>
              </div>
              <BranchProductsChart period={productsPeriod.value} />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mb-4">
                <h3 className="text-xl font-bold text-center sm:text-left text-gray-800">
                  <LinkText
                    text="Cupones"
                    className="text-xl font-bold"
                    onClick={() => navigate("/business/coupons")}
                  />{" "}
                  más usados
                </h3>

                <div className="flex w-full sm:w-48 justify-center sm:justify-end">
                  <FormSelect
                    label=""
                    id="branches"
                    name="branches"
                    selected={couponsPeriod}
                    options={PERIODS}
                    onChange={(p) =>
                      setCouponsPeriod(PERIODS.find((item) => item.value === p)!)
                    }
                    containerClassName="max-w-[10rem]"
                  />
                </div>
              </div>
              <BranchCouponsChart period={couponsPeriod.value} />
            </div>
          </div>
        </div>
      </div>

      {/* Sales stats */}
      <div className="w-full hidden md:block mt-6 lg:mt-10 xl:hidden">
        <h3 className="text-center md:text-left text-2xl font-bold text-gray-800">
          Ganancias diarias
        </h3>
        <BranchSalesChart data={saleStatsData} />
      </div>
    </BusinessMainPage>
  );
};

export default Dashboard;
