import { Box, Button } from "@chakra-ui/react";
import { Sidebar } from "components/Sidebar/Sidebar";
import { withRouter, RouteComponentProps } from "react-router-dom";
import React from "react";
import axios, { API } from "utils/axios-config";
import PlayerTable from "components/PlayerTable/PlayerTable";
import Card from "components/Card/Card";
import { CardSuit } from "interface/CardSuit";
import { CardValue } from "interface/ICard";

const URL = process.env.NODE_ENV === "production" ? "http://46.101.149.241:5000" : "http://localhost:5000";

class MainPage extends React.PureComponent<RouteComponentProps> {
	createNewGame = () => {
		// console.log('Create New Game')
		// socket.auth = { username: "Player1" }
		// socket.connect();
		const requestOptions = {
			method: "POST",
		};

		fetch(`${URL}/game`, requestOptions)
			.then((response: any) => response.json())
			.then((responseJSON) => {
				console.log(responseJSON);
				this.props.history.push(`/game/${responseJSON.gameId}`);
			})
			.catch((err) => {
				console.log(err);
				return;
			});
	};

	values: CardValue[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
	suits: CardSuit[] = ["hearts", "diamonds", "spades", "clubs"];

	render() {
		return (
			<Box>
				<Box position="relative" height="100%">
					{/* Margin from Sidebar */}
					<Button onClick={this.createNewGame}>Create New Game</Button>
				</Box>
			</Box>
		);
	}
}

export default withRouter(MainPage);
