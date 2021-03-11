import {
	createNewGameLobby,
	findGameById,
	getAllActiveGames,
	joinGameLobby,
	removeAllActiveGames,
	updatePlayerReadyStateAndBet,
} from "./GameManager";
import { v4 as uuidv4 } from "uuid";
import InvalidActionError from "./Errors/InvalidActionError";
import GameLobyCapacityExceeded from "./Errors/GameLobyCapacityExceeded";

// TODO REWIRE
// import rewire from "rewire";
// import GameLobby from "./GameLobby";
// const GameManagerFile = rewire("./GameManager");
// const createNewGameLobby: (id: string) => GameLobby = GameManagerFile.__get__("createNewGameLobby");
const MAXIMAL_CAPACITY_GAME_LOBBIES = 20;

describe("GameManager Class", () => {
	afterEach(() => {
		removeAllActiveGames();
	});

	describe("Join a Gamelobby", () => {
		const gameLobbyId = uuidv4();

		it("Player wants to join a lobby that does not exist yet. Therefore a new lobby is created.", () => {
			expect(findGameById(gameLobbyId)).toBeNull();

			joinGameLobby("playerOneId", "Player1", gameLobbyId);

			expect(getAllActiveGames()).toContain(findGameById(gameLobbyId));
		});

		it("Player joins an existing lobby. A new lobby will therefore not be created.", () => {
			joinGameLobby("playerOneId", "Player1", gameLobbyId);
			const countGameLobbies = getAllActiveGames().length;

			joinGameLobby("playerTwoId", "Player2", gameLobbyId);

			expect(getAllActiveGames().length).toBe(countGameLobbies);
			expect(getAllActiveGames()).toContain(findGameById(gameLobbyId));
		});
	});

	describe("Player changes Ready State", () => {
		it("Player tries to change Ready state in a lobby is not part of. (Not normal flow, input probably manipulated)", () => {
			expect(() => {
				updatePlayerReadyStateAndBet("notExistingId", "Player1", true, 14, "hearts");
			}).toThrow(
				new InvalidActionError("Cannot change ready state in a lobby that does not exist. Probably input was manipulated")
			);
		});
	});

	describe("Creating new GameLobby", () => {
		it("Exceeding maximal capacity of GameLobbies", () => {
			for (let i = 0; i < MAXIMAL_CAPACITY_GAME_LOBBIES; i++) {
				createNewGameLobby(uuidv4());
			}

			expect(() => {
				createNewGameLobby(uuidv4());
			}).toThrow(GameLobyCapacityExceeded);
		});

		// new GameLobyCapacityExceeded("Capacity of allowed Game Lobbies has been exceeded. Wait until a GameLobby has been closed")
	});

	describe.skip("Remove user due to disconnect", () => {});

	describe.skip("Remove user due to ban by gamemaster", () => {});

	describe.skip("Grant Admin rights to user", () => {});

	describe.skip("Draw Next Card", () => {});

	describe.skip("Start New Round", () => {});
});
