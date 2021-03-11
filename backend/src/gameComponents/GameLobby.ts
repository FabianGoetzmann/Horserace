import { joinGameLobby } from "./GameManager";
import { CardSuit } from "./Card";
import PlayerDoesNotExistError from "./Errors/PlayerDoesNotExistError";
import Game, { GameInfo } from "./Game";
import Player, { PlayerInfo } from "./Player";
import UserNameTakenError from "./Errors/UserNameTaken";
import InvalidInputError from "./Errors/InvalidInputError";
import InvalidActionError from "./Errors/InvalidActionError";
import PlayerCapacityExceeded from "./Errors/PlayerCapacityExceeded";

type GameLobbyInformation = {
	statistics: {
		roundsPlayed: number;
	};
	players: Player[];
	allPlayersReady: boolean;
	currentGame: GameInfo;
};

export interface IGameLobby {
	id: string;
	roundsPlayed: number;
	game: Game;
	players: Player[];

	addPlayer(userId: string, userName: string): Player;
	removePlayerByName(userName: string): Player | null;
	removePlayerById(id: string): Player | null;
	getPlayerById(id: string): Player | null;
	getAllPlayers(): Player[];
	updatePlayerReadyStateAndBet(id: string, ready: boolean, bet?: number, suit?: CardSuit): void;
	getGameLobbyInformation(): GameLobbyInformation;
	playersResetReady(): void;
	startNewRound(): void;
	drawNextCard(): void;
}

export const PLAYER_LIMIT_PER_ROOM = 20;

export default class GameLobby implements IGameLobby {
	id: string;
	roundsPlayed: number;
	game: Game;
	players: Player[];

	constructor(id: string) {
		this.id = id;
		this.roundsPlayed = 0;
		this.game = new Game();
		this.players = [];
	}

	addPlayer(userId: string, userName: string): Player {
		if (this.players.length >= PLAYER_LIMIT_PER_ROOM) {
			throw new PlayerCapacityExceeded(`GameLobby is already full. Maximal ${PLAYER_LIMIT_PER_ROOM} players allowed.`);
		}

		const idConflicts = this.players.filter((player) => player.id === userId);
		if (idConflicts.length > 0) {
			throw new Error("Conflict between user IDs");
		}

		const nameConflicts = this.players.filter((player) => player.name === userName);
		if (nameConflicts.length > 0) {
			throw new UserNameTakenError(`Username ${userName} is already taken`);
		}
		const isGamemaster = this.players.length === 0;
		const newPlayer = new Player(userId, userName, isGamemaster);

		if (this.game.state === "active") {
			// Is in waiting room
			newPlayer.setIsInGame(false);
		}

		this.players.push(newPlayer);

		return newPlayer;
		// throw new Error("Method not implemented.");
	}

	removePlayerByName(userName: string) {
		const index = this.players.findIndex((player) => player.name === userName);
		if (index !== -1) {
			console.log("Removing Player:", this.players[index]);
			return this.players.splice(index, 1)[0];
		}
		return null;
	}

	removePlayerById(id: string) {
		const index = this.players.findIndex((player) => player.id === id);
		// if(index )
		if (index === -1) {
			return null;
		}
		console.log("Removing Player:", this.players[index]);

		const removedPlayer = this.players.splice(index, 1)[0];

		// Assign new Gamemaster if none exists
		if (this.players.length > 0 && this.players.filter((player) => player.gamemaster).length === 0) {
			const playersSortedByJoinTime = this.players.sort(function (a, b) {
				let keyA = new Date(a.joinedLobby),
					keyB = new Date(b.joinedLobby);
				// Compare the 2 dates
				if (keyA < keyB) return -1;
				if (keyA > keyB) return 1;
				return 0;
			});
			playersSortedByJoinTime[0].setGamemaster(true);
		}

		// TODO: Special case: Gamemaster left, while remaining players are in waiting list => notify other players and restart game

		return removedPlayer;
	}

	getPlayerById(id: string): Player | null {
		const index = this.players.findIndex((player) => player.id === id);
		if (index !== -1) {
			return this.players[index];
		} else {
			return null;
		}
	}

	getAllPlayers(): Player[] {
		const playerInfo: PlayerInfo[] = [];
		for (const player of this.players) {
			playerInfo.push(player.getPlayerInfo());
		}
		return this.players;
	}

	updatePlayerReadyStateAndBet = (id: string, ready: boolean, bet?: number, suit?: CardSuit) => {
		const index = this.players.findIndex((player) => player.id === id);

		if (index === -1) {
			throw new InvalidActionError("Player does not exist. Input must have been manipulated.");
		}

		if (this.game.state === "active") {
			throw new InvalidActionError("You cannot change the ready state during an active game");
		}

		const player = this.players[index];

		if (!player.isInGame) {
			throw new InvalidActionError("You cannot change the ready state while you are in the waiting room");
		}

		player.setReady(ready);

		if (ready) {
			if (bet || bet === 0) {
				player.setBet(bet);
			}
			if (suit) {
				player.setSuit(suit);
			}
		} else {
			player.resetBet();
			player.resetSuit();
		}
		console.log(`[Update] - Updated ${player.name} ready state to ${ready}.`);
	};

	getGameLobbyInformation = (): GameLobbyInformation => {
		return {
			statistics: {
				roundsPlayed: this.roundsPlayed,
			},
			players: this.getAllPlayers(),
			allPlayersReady: this.getAllPlayers().every((v) => v.ready === true),
			currentGame: this.game.getGameInfo(),
		};
	};

	playersResetReady = () => {
		for (const player of this.players) {
			// TODO. Next feature save bets.
			player.setReady(false);
		}
	};

	movePlayersFromWaitingRoomIntoTheGame = () => {
		this.players.map((player) => {
			player.setIsInGame(true);
		});
	};

	startNewRound = () => {
		// Game can be restarted at every time
		// So that they will be remembered to apply new bets
		this.movePlayersFromWaitingRoomIntoTheGame();
		this.playersResetReady();
		this.game.initializeNewGame();
	};

	drawNextCard = () => {
		const allPlayersInGame = this.players.filter((player) => player.isInGame);
		const allPlayersInGameReady = allPlayersInGame.every((v) => v.ready === true);
		if (!allPlayersInGameReady) {
			throw new InvalidActionError(
				"All Players who are in the game (and not in the waiting room) must be ready to draw the next card"
			);
		}

		const winner = this.game.nextMove();
		if (winner) {
			console.log(winner);
			// this.game.
			this.roundsPlayed += 1;

			// CALCULATE AND SAFE STATISTICS HERE
		}
	};

	assignGameMasterRights(newGameMasterId: string) {
		const index = this.players.findIndex((player) => player.id === newGameMasterId);
		// if(index )
		if (index === -1) {
			return null;
		}
		const newGameMaster = this.players[index];
		newGameMaster.setGamemaster(true);
		return newGameMaster;
	}
}
