import { NextFunction, Request, Response } from "express";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface CustomizedSocket extends Socket {
	username: string;
}

import express from "express";
import cors from "cors";

import Game from "./gameComponents/Game";
import {
	findGameById,
	joinGameLobby,
	kickUserById,
	removeUserAfterDisconnect,
	updatePlayerReadyStateAndBet,
	drawNextCard,
	startNewRound,
	assignGameMaster,
} from "./gameComponents/GameManager";
import Player from "./gameComponents/Player";
import GameLobby from "./gameComponents/GameLobby";

const PORT = process.env.PORT || 5000;
const HOSTNAME = "0.0.0.0";

const PRODUCTION = process.env.NODE_ENV;

const app = express();

if (PRODUCTION) {
	console.log("PRODUCTION");
	// app.use((req, res, next) => {
	// 	res.header("Access-Control-Allow-Origin", "*");
	// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type,Accept");
	// 	next();
	// });
}

app.use(express.static("public"));

app.use(cors({ origin: true }));

console.log("Production: ", PRODUCTION);

const http = require("http").Server(app);

const io = require("socket.io")(http, {
	cors: {
		origin: PRODUCTION ? "http://46.101.149.241:3000" : "http://localhost:3000",
	},
});

io.on("connection", (socket: Socket) => {
	socket.on("joinGame", ({ userName, gameLobbyName }, cb) => {
		try {
			const userId = socket.id;
			joinGameLobby(userId, userName, gameLobbyName);
		} catch (err) {
			// Different messages: player with name exists, gameLobbyAmount exceeed, players in room exceeded
			if (err.errMsgClient) {
				console.log(err);
				cb(err.errMsgClient);
			}
			return;
		}

		socket.join(gameLobbyName);
		console.log(userName, "joined", gameLobbyName);
		cb(null, {
			successfull: true,
			message: `Joined GameLobby ${gameLobbyName}`,
		});

		const gameLobby = findGameById(gameLobbyName);
		if (gameLobby) {
			io.to(gameLobbyName).emit("gameInformation", gameLobby.getGameLobbyInformation());
		}
	});

	socket.on("updateReady", ({ ready, bet, gameLobby, suit }, cb) => {
		const userId = socket.id;
		let updatedLobby: GameLobby;
		try {
			updatedLobby = updatePlayerReadyStateAndBet(gameLobby, userId, ready, bet, suit);
		} catch (err) {
			console.log(err);
			cb(err);
			return;
		}

		io.to(gameLobby).emit("gameInformation", updatedLobby.getGameLobbyInformation());
	});

	socket.on("nextMove", ({ gameId }, cb) => {
		console.log("nextMove");
		let updatedGameLobby;
		try {
			updatedGameLobby = drawNextCard(gameId, socket.id);
		} catch (err) {
			console.log(err);
			cb(err);
			return;
		}
		io.to(gameId).emit("gameInformation", updatedGameLobby);
	});

	socket.on("startNewGame", ({ gameId }, cb) => {
		let updatedGameLobby;
		try {
			updatedGameLobby = startNewRound(gameId, socket.id);
		} catch (err) {
			console.log(err);
			cb(err);
			return;
		}
		io.to(gameId).emit("gameInformation", updatedGameLobby);
	});

	socket.on("kickPlayer", ({ gameId, userToKickId }, cb) => {
		let kickedPlayer: Player;
		try {
			kickedPlayer = kickUserById(gameId, socket.id, userToKickId);
		} catch (err) {
			console.log(err);
			return;
		}
		const gameLobby = findGameById(gameId);
		if (!gameLobby) {
			// TODO
			console.log("sonderfall");
			return;
		}
		io.to(userToKickId).emit("kickedFromLobby", "You were kicked from the lobby.");
		io.to(gameId).emit("gameInformation", gameLobby.getGameLobbyInformation());
	});

	socket.on("assignGameMaster", ({ gameId, newGameMasterId }, cb) => {
		console.log("newGameMasterId");
		let newGameMaster: Player;
		try {
			console.log(gameId, socket.id, newGameMasterId);
			newGameMaster = assignGameMaster(gameId, socket.id, newGameMasterId);
		} catch (err) {
			console.log(err);
			return;
		}
		const gameLobby = findGameById(gameId);
		if (!gameLobby) {
			// TODO
			return;
		}
		io.to(gameId).emit("gameInformation", gameLobby.getGameLobbyInformation());
	});

	// // notify users upon disconnection
	socket.on("disconnect", () => {
		console.log(`[DISCONNECT] Socket:  ${socket.id}`);
		const gameLobby = removeUserAfterDisconnect(socket.id);
		if (gameLobby) {
			io.to(gameLobby.id).emit("gameInformation", gameLobby.getGameLobbyInformation());
		}
	});
});

app.get("/", (req: Request, res: Response) => {
	res.sendFile("index.html");
});

app.post("/game", (req: Request, res: Response) => {
	console.log("Creating new Game:");
	const gameId = uuidv4();

	res.send({
		gameId: gameId,
	});
});

app.post("/updateGame", (req: Request, res: Response) => {
	console.log("Creating new Game:");

	res.send("ja");
});

http.listen(PORT, HOSTNAME, () => {
	console.log(`httpServer running at http://${HOSTNAME}:${PORT}/`);
});
