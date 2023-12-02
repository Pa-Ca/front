import { StrictMode } from "react";
import "./index.css";
import App from "./App";
import { Metric } from "web-vitals";
import { store } from "./store/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";

const reportWebVitals = () => {
  const onReport = (metric: Metric) => {
    if (metric.rating !== "good") {
      console.warn(
        `The metric ${metric.name} has a ${metric.rating} rating. Current value: ${metric.value}`
      );
    }
  };

  import("web-vitals").then(({ onFID, onLCP, onCLS, onFCP, onINP, onTTFB }) => {
    onFID(onReport);
    onLCP(onReport);
    onCLS(onReport);
    onFCP(onReport);
    onINP(onReport);
    onTTFB(onReport);
  });
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  </BrowserRouter>
);

// Web Vitals reports
reportWebVitals();
