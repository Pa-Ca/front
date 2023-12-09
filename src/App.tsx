import "./App.css";
import { FC } from "react";
import { Alert } from "@components";
import AppRoutes from "./AppRoutes";
import { Subscribe } from "@react-rxjs/core";
import { useAppSelector } from "./store/hooks";
import { Route, Routes } from "react-router-dom";

const App: FC = () => {
  const auth = useAppSelector((state) => state.auth);

  return (
    <Subscribe>
      <Routes>
        {AppRoutes.filter(
          (route) =>
            route.auth === auth.logged && (!auth.logged || route.role === auth.user?.role)
        ).map((route, index) => {
          const { element, ...rest } = route;
          return <Route key={index} {...rest} element={element} />;
        })}
      </Routes>

      <Alert />
    </Subscribe>
  );
};

export default App;
