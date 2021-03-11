import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createRoutes } from "./routes";
import { Box, ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
	<React.StrictMode>
		{/* <div style={{ height: "100vh" }}> */}
		<ChakraProvider resetCSS={true}>{createRoutes()}</ChakraProvider>
		{/* </div> */}
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
