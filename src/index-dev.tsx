

import * as React from "react"
import * as ReactDOM from "react-dom"
import {AppContainer} from "react-hot-loader"
import App from "./App"
import "./styles/custom.css"
declare var module: any;
declare module "react-hot-loader"

console.log('Startd ss!') // tslint:disable-line

const rootEl = document.getElementById("app")
ReactDOM.render(
  <AppContainer>
    <App/>
  </AppContainer>,
  rootEl
)


// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./App", () => {
    let NextApp = require("./App").default
    ReactDOM.render(
      <AppContainer>
        <NextApp/>
      </AppContainer>
      ,
      rootEl
    )
  })
}


