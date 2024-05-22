import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { TourProvider } from "@reactour/tour";
// const styles = {
//   close: "disabled",
// };
const steps = [
  {
    selector: ".first-step",
    content: "This is the page Logo",
    position: "bottom",
  },
  {
    selector: ".second-step",
    content: "This is the home nav link ",
    position: "bottom",
  },
  {
    selector: ".third-step",
    content:
      "This is the about nav link erm,.tjklgjlkadjfglkjsgl;kjasdgklsdiofjSLEKFJ ",
    position: "bottom",
  },
  {
    selector: ".fourth-step",
    content: "This is the service nav link ",
    position: "bottom",
  },
];

ReactDOM.createRoot(document.getElementById("root")).render(
  <TourProvider steps={steps}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TourProvider>
);
