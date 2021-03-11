import { CardSuit } from "./Card";
import PlayerDoesNotExistError from "./Errors/PlayerDoesNotExistError";
import GameLobby from "./GameLobby";
import NotAuthorizedError from "./Errors/NotAuthorizedError";
import { PlayerInfo } from "./Player";
import InvalidActionError from "./Errors/InvalidActionError";
import GameLobyCapacityExceeded from "./Errors/GameLobyCapacityExceeded";

const activeGames: GameLobby[] = [];

const MAXIMAL_CAPACITY_GAME_LOBBIES = 20;

export const joinGameLobby = (userId: string, userName: string, lobbyName: string) => {
	let gameLobby = findGameById(lobbyName);
	if (gameLobby) {
		gameLobby.addPlayer(userId, userName);
		console.log(`Adding Player ${userName} to existing Lobby`);
	} else {
		console.log(`Creating new lobby`);
		gameLobby = createNewGameLobby(lobbyName);
		gameLobby.addPlayer(userId, userName);
	}
};

// TODO INTERNAL
export const createNewGameLobby = (id: string) => {
	if (getAllActiveGames().length >= MAXIMAL_CAPACITY_GAME_LOBBIES) {
		throw new GameLobyCapacityExceeded("Capacity of allowed Game Lobbies has been exceeded.", {
			title: "Capacity of allowed Game Lobbies has been exceeded.",
			description: "Wait until a GameLobby has been closed",
		});
	}
	// Check if roow with this id already exists
	const idConflicts = activeGames.filter((gameLobby) => {
		gameLobby.id === id;
	}).length;
	if (idConflicts > 0) {
		throw Error("Game with this id already exists");
	}

	const newGame = new GameLobby(id);
	activeGames.push(newGame);
	return newGame;
};

export const updatePlayerReadyStateAndBet = (
	gameLobbyId: string,
	userId: string,
	ready: boolean,
	bet?: number,
	suit?: CardSuit
): GameLobby => {
	const game = findGameById(gameLobbyId);

	if (!game) {
		throw new InvalidActionError("Cannot change ready state in a lobby that does not exist. Probably input was manipulated");
	}

	game.updatePlayerReadyStateAndBet(userId, ready, bet, suit);

	return game;
};

// Called after user has disconnected.
// TODO: Has to be improved. Because it does a greedy search through all open lobbies.
// Need other GameLobby/Player matching
export const removeUserAfterDisconnect = (userId: string) => {
	for (const gameLobby of activeGames) {
		gameLobby.removePlayerById(userId);

		if (gameLobby.getAllPlayers().length === 0) {
			deleteGameLobby(gameLobby.id);
		}
		return gameLobby;
	}
};

const deleteGameLobby = (gameLobbyId: string) => {
	const index = activeGames.findIndex((game) => game.id === gameLobbyId);
	if (index !== -1) {
		console.log("Removing GameLobby: ", gameLobbyId);
		return activeGames.splice(index, 1)[0];
	}
};

export const drawNextCard = (gameId: string, userId: string) => {
	const gameLobby = findGameById(gameId);

	if (!gameLobby) {
		throw new Error("Todo");
	}

	const player = gameLobby.getPlayerById(userId);
	if (!player) {
		throw new Error("Todo");
	}
	if (!player.gamemaster) {
		throw new NotAuthorizedError("You cannot draw the next card");
	}

	gameLobby.drawNextCard();

	return gameLobby.getGameLobbyInformation();
};

export const startNewRound = (gameId: string, userId: string) => {
	const gameLobby = findGameById(gameId);

	if (!gameLobby) {
		throw new Error("Todo");
	}

	const player = gameLobby.getPlayerById(userId);
	if (!player) {
		throw new Error("Todo");
	}
	if (!player.gamemaster) {
		throw new NotAuthorizedError("You cannot draw the next card");
	}

	gameLobby.startNewRound();

	return gameLobby.getGameLobbyInformation();
};

export const kickUserById = (gameId: string, userId: string, userToKickId: string) => {
	const gameLobby = findGameById(gameId);

	if (!gameLobby) {
		throw new Error("Todo");
	}

	const player = gameLobby.getPlayerById(userId);
	if (!player) {
		console.log("NO PLAETERAW");
		throw new PlayerDoesNotExistError(`Player with the id ${userId} does not exist`);
	}
	if (!player.gamemaster) {
		throw new NotAuthorizedError("You cannot draw the next card");
	}

	const playerToKick = gameLobby.removePlayerById(userToKickId);
	if (!playerToKick) {
		throw new PlayerDoesNotExistError(`Player with the id ${userToKickId} that has to be removed does not exist`);
	}

	console.log(`Removed Player ${playerToKick.name} from Lobby ${gameId}`);
	return playerToKick;
};

export const findGameById = (id: string) => {
	const index = activeGames.findIndex((gameLobby) => gameLobby.id === id);

	if (index !== -1) {
		return activeGames[index];
	} else {
		return null;
	}
};

export const assignGameMaster = (gameId: string, userId: string, newGameMasterId: string) => {
	const gameLobby = findGameById(gameId);

	if (!gameLobby) {
		throw new Error("Todo");
	}

	const player = gameLobby.getPlayerById(userId);
	if (!player) {
		throw new PlayerDoesNotExistError(`Player with the id ${userId} does not exist`);
	}
	if (!player.gamemaster) {
		throw new NotAuthorizedError("You cannot grant other player game master rights, since you are not one yourself.");
	}

	const newGameMaster = gameLobby.assignGameMasterRights(newGameMasterId);
	if (!newGameMaster) {
		throw new PlayerDoesNotExistError(`Player with the id ${newGameMasterId} that has to be removed does not exist`);
	}

	console.log(`Removed Player ${newGameMaster.name} from Lobby ${gameId}`);
	return newGameMaster;
};

export const getAllActiveGames = () => {
	return activeGames;
};

export const removeAllActiveGames = () => {
	activeGames.splice(0, activeGames.length);
};
