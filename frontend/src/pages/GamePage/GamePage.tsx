import { Box, Button, Flex, Input, toast, usePrevious, useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import io from "socket.io-client";
import socket from "../../socket";

import { RouteComponentProps } from "react-router";
import LogIn from "components/LogIn/LogIn";
import { IPlayerInfo } from "../../interface/IPlayerInfo";
import PlayerTable from "components/PlayerTable/PlayerTable";
import { forEachTrailingCommentRange } from "typescript";
import { IGameData } from "interface/IGameData";
import { CardSuit } from "interface/CardSuit";
import { GameField } from "components/GameField/GameField";
import FinishedGameModal from "components/FinishedGameModal/FinishedGameModal";
import { start } from "repl";

interface IMatchParams {
	gameId: string;
}

interface IGamePageProps extends RouteComponentProps<IMatchParams> {}

// let socket: SocketIOClient.Socket;

const GamePage = (props: IGamePageProps) => {
	const [joinedLobby, setJoinedLobby] = useState(false);
	const [myself, setMyself] = useState<IPlayerInfo>();
	const prevMyself = usePrevious(myself);

	const [gameData, setGameData] = useState<IGameData>();

	const [myReady, setReady] = useState(false);
	const [myBet, setBet] = useState(0);
	const [mySuit, setMySuit] = useState<CardSuit>("hearts");

	const [waitingRoomNotificationAlreadyShown, setWaitingRoomNotificationAlreadyShown] = useState(false);

	const toast = useToast();
	const toastIdRef = React.useRef<string | number>();

	useEffect(() => {
		socket.connect();
	}, []);

	useEffect(() => {
		socket.on("gameInformation", async (gameData: IGameData) => {
			const players = await preprocessPlayers(gameData.players);

			gameData.players = players;

			setGameData(gameData);
			console.log(gameData);
		});

		socket.on("kickedFromLobby", (message: any) => {
			console.log(message);
			props.history.push("/");
		});

		return function cleanup() {
			if (toastIdRef.current) {
				toast.close(toastIdRef.current);
			}
			socket.close();
		};
	}, []);

	useEffect(() => {
		if (myself && !myself.isInGame && !waitingRoomNotificationAlreadyShown) {
			setWaitingRoomNotificationAlreadyShown(true);
			toastIdRef.current = toast({
				title: "You are in the waiting room",
				description: "You will join the game when current round is finished",
				status: "info",
				duration: null,
				isClosable: true,
			});
		}

		if (prevMyself && !prevMyself.isInGame && myself && myself.isInGame) {
			if (toastIdRef.current) {
				toast.close(toastIdRef.current);
				toastIdRef.current = toast({
					title: "You have joined the game",
					status: "success",
					duration: 2000,
					isClosable: true,
				});
			}
		}
	}, [myself]);

	const preprocessPlayers = async (players: any) => {
		for (const player of players) {
			player.self = player.id === socket.id;
			if (player.id === socket.id) {
				setMyself(player);
				console.log(player);
				setReady(player.ready);
			}
		}
		// Show current user first, and then sort by username
		players.sort((a: any, b: any) => {
			if (a.self) return -1;
			if (b.self) return 1;
			if (a.username < b.username) return -1;
			return a.username > b.username ? 1 : 0;
		});
		return players;
	};

	const drawNextCard = () => {
		socket.emit("nextMove", { gameId: props.match.params.gameId }, (err: any) => {
			console.log(err);
		});
	};

	const kickPlayerFromLobby = (playerToKickId: string) => {
		socket.emit("kickPlayer", { gameId: props.match.params.gameId, userToKickId: playerToKickId }, (err: any) => {
			console.log(err);
		});
	};

	const assignGameMaster = (newGameMasterId: string) => {
		console.log("new admin");
		console.log(newGameMasterId);
		socket.emit("assignGameMaster", { gameId: props.match.params.gameId, newGameMasterId: newGameMasterId }, (err: any) => {
			console.log(err);
		});
	};

	const changeReadyState = (newReady: boolean, newBet: number) => {
		const gameId = props.match.params.gameId;
		setReady(newReady);

		socket.emit("updateReady", { gameLobby: gameId, ready: newReady, bet: newBet, suit: mySuit }, (err: any) => {
			console.log(err);
		});
	};

	const startNewGame = () => {
		console.log("STARTING NEW GAME");
		socket.emit("startNewGame", { gameId: props.match.params.gameId }, (error: any) => {
			console.log(error);
		});
		console.log("Start new game");
	};

	const gameDataExists = gameData && gameData.currentGame;

	const areAllPlayersInGameReady = () => {
		if (gameData) {
			return gameData.players.filter((p) => p.isInGame).every((p) => p.ready);
		}
		return false;
	};

	return (
		<Box height="100%">
			{joinedLobby ? (
				<>
					{gameData && myself && (
						<>
							<Box>Game State: {gameData.currentGame.gameState}</Box>

							{gameData.currentGame.winner && (
								<FinishedGameModal
									isOpen={gameData && gameData.currentGame.gameState === "finished"}
									suitWinner={gameData.currentGame.winner}
									myself={myself}
									startNewGame={startNewGame}
									playerWon={gameData.players.filter((player) => {
										return player.bettedOnSuit === gameData.currentGame.winner;
									})}
								/>
							)}

							{gameDataExists && (
								<GameField
									gameData={{ ...gameData.currentGame }}
									allPlayersReady={areAllPlayersInGameReady()}
									myselfGameMaster={myself.gamemaster}
									drawCard={drawNextCard}
									startNewGame={startNewGame}
								/>
							)}

							<PlayerTable
								players={gameData.players}
								changeReadyState={changeReadyState}
								myBet={myBet}
								setBet={setBet}
								myReady={myReady}
								myself={myself}
								assignGameMaster={assignGameMaster}
								mySuit={mySuit}
								disableReadyCheck={gameData.currentGame.gameState === "active" && areAllPlayersInGameReady()}
								setMySuit={setMySuit}
								kickPlayer={kickPlayerFromLobby}
							/>
						</>
					)}
				</>
			) : (
				<Flex justifyContent="center" alignItems="center" height="30%">
					<LogIn gameId={props.match.params.gameId} joinedLobby={setJoinedLobby} />
				</Flex>
			)}
		</Box>
	);
};

export default GamePage;
