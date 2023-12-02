import "./App.css";
import { FC } from "react";
import AppRoutes from "./AppRoutes";
import { Route, Routes } from "react-router-dom";

const App: FC = () => {
  return (
    <Routes>
      {AppRoutes.map((route, index) => {
        const { element, ...rest } = route;
        return <Route key={index} {...rest} element={element} />;
      })}
    </Routes>
  );
};

export default App;
