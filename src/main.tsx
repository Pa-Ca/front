import { StrictMode } from "react";
import App from "./App";
import "./styles/index.css";
import { store } from "./store/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { onFID, onLCP, onCLS, onFCP, onINP, onTTFB } from "web-vitals";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  </BrowserRouter>
);

// Web Vitals reports
onFID(console.log);
onLCP(console.log);
onCLS(console.log);
onFCP(console.log);
onINP(console.log);
onTTFB(console.log);
