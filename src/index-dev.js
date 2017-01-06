import './styles/custom.css';
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./App";

/* eslint no-console:0 */
console.log('Startd ss!');

const rootEl = document.getElementById("app");
ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
);



// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./App", () => {
    let NextApp = require("./App").default;
    ReactDOM.render(
      <AppContainer>
        <NextApp/>
      </AppContainer>
      ,
      rootEl
    );
  });
}


