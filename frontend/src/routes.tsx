import { ChakraProvider, Box } from "@chakra-ui/react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import MainPage from "./pages/MainPage/MainPage";
import * as React from "react";
import GamePage from "./pages/GamePage/GamePage";

export const createRoutes = () => {
	return (
		<BrowserRouter>
			<Navbar />
			{/* 60px = Navbar height */}
			<Box w="100%" h="calc(100vh - 60px)">
				<Switch>
					<Route exact path="/" component={MainPage} />
					<Route exact path="/game/:gameId" component={GamePage} />
				</Switch>
			</Box>
		</BrowserRouter>
	);
};
