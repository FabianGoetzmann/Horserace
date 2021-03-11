import faker from "faker";
import InvalidActionError from "./Errors/InvalidActionError";
import PlayerCapacityExceeded from "./Errors/PlayerCapacityExceeded";
import UserNameTakenError from "./Errors/UserNameTaken";
import GameLobby, { IGameLobby, PLAYER_LIMIT_PER_ROOM } from "./GameLobby";
import Player from "./Player";

describe("Class GameLobby", () => {
	let gameLobby: IGameLobby;
	beforeEach(() => {
		const id = faker.random.alphaNumeric(20);
		gameLobby = new GameLobby(id);
	});

	describe("Create new GameLobby", () => {
		it("After initial creations there should be no players in lobby, no rounds have been played and a new Game must have been created", () => {
			expect(gameLobby.roundsPlayed).toBe(0);
			expect(gameLobby.players.length).toBe(0);
			expect(gameLobby.game).not.toBeUndefined();
		});
	});

	describe("Add new Player to GameLobby", () => {
		it("Add successfully a new player to the lobby", () => {
			const oldPlayerSize = gameLobby.players.length;
			const newPlayer = gameLobby.addPlayer("playerId", "Player 1");

			expect(newPlayer).not.toBeNull();
			expect(gameLobby.players).toContain(newPlayer);
			expect(gameLobby.players.length).toBe(oldPlayerSize + 1);
		});

		it("If a new Player is added to an empty GameLobby, the player is granted gamemaster rights", () => {
			const newPlayer = gameLobby.addPlayer("playerId", "Player 1");

			expect(newPlayer.gamemaster).toBe(true);
		});

		it("If a new Player is added to a lobby with at least one player, he wont be granted gamemaster rights", () => {
			const newPlayer = gameLobby.addPlayer("playerId", "Player 1");
			const secondNewPlayer = gameLobby.addPlayer("playerId2", "Player 2");

			expect(secondNewPlayer.gamemaster).toBe(false);
		});

		it("If a new Player was added to a GameLobby, his Ready state is false and he has not done any bets yet", () => {
			const newPlayer = gameLobby.addPlayer("playerId", "Player 1");
			expect(newPlayer.ready).toBe(false);
			expect(newPlayer.bet).toBeUndefined();
			expect(newPlayer.bettedOnSuit).toBeUndefined();
		});

		it("There cannot be two Players with equal names in the same GameLobby", () => {
			gameLobby.addPlayer("playerId", "Player 1");
			const userNamePlayerTwo = "Player 1";
			expect(() => {
				gameLobby.addPlayer("playerId2", userNamePlayerTwo);
			}).toThrow(new UserNameTakenError(`Username ${userNamePlayerTwo} is already taken`));
		});

		it("There cannot be two Players with equal IDs in the same GameLobby", () => {
			gameLobby.addPlayer("playerId", "Player 1");
			const userID2 = "Player 1";
			expect(() => {
				gameLobby.addPlayer("playerId", "Player 2");
			}).toThrow(new Error("Conflict between user IDs"));
		});

		it("Add Players until the maximal room capacity is reached", () => {
			for (let i = 0; i < PLAYER_LIMIT_PER_ROOM; i++) {
				expect(() => {
					gameLobby.addPlayer(`playerId${i}`, `Player${i}`);
				}).not.toThrow();
			}
		});

		it("If the maximal room capacity is reached, no further player can be added", () => {
			for (let i = 0; i < PLAYER_LIMIT_PER_ROOM; i++) {
				gameLobby.addPlayer(`playerId${i}`, `Player${i}`);
			}

			expect(() => {
				gameLobby.addPlayer(`playerId${PLAYER_LIMIT_PER_ROOM + 1}`, `Player${PLAYER_LIMIT_PER_ROOM}`);
			}).toThrow(
				new PlayerCapacityExceeded(`GameLobby is already full. Maximal ${PLAYER_LIMIT_PER_ROOM} players allowed.`)
			);
		});
	});

	describe("Remove Player by Name", () => {
		it("Remove successfully", () => {
			const playerName = "Player 1";
			const newPlayer = gameLobby.addPlayer("playerId", playerName);
			const playersSize = gameLobby.players.length;

			const removedPlayer = gameLobby.removePlayerByName(playerName);

			expect(gameLobby.players.length).toBe(playersSize - 1);
			expect(removedPlayer).toBe(newPlayer);
			expect(gameLobby.players).not.toContain(removedPlayer);
		});
		it("A non existing player in a lobby cannot be removed", () => {
			gameLobby.addPlayer("playerId", "Player 1");
			const amountPlayersBeforeRemove = gameLobby.players.length;

			const removedPlayer = gameLobby.removePlayerByName("NonExistingName");
			expect(removedPlayer).toBeNull();
			expect(gameLobby.players.length).toBe(amountPlayersBeforeRemove);
		});
	});

	describe("Remove Player by ID", () => {
		it("Remove successfully", () => {
			const playerId = "playerId";
			const newPlayer = gameLobby.addPlayer(playerId, "Player 1");
			const playersSize = gameLobby.players.length;

			const removedPlayer = gameLobby.removePlayerById(playerId);

			expect(gameLobby.players.length).toBe(playersSize - 1);
			expect(removedPlayer).toBe(newPlayer);
			expect(gameLobby.players).not.toContain(removedPlayer);
		});
		it("A non existing player in a lobby cannot be removed", () => {
			gameLobby.addPlayer("playerId", "Player 1");
			const amountPlayersBeforeRemove = gameLobby.players.length;

			const removedPlayer = gameLobby.removePlayerById("NonExistingName");
			expect(removedPlayer).toBeNull();
			expect(gameLobby.players.length).toBe(amountPlayersBeforeRemove);
		});

		it("If removed Player was the only Gameadmin, the Player who joined the room after the removed Player becomes Gameadmin", () => {
			const playerOne = gameLobby.addPlayer("player1", "Player1");
			const playerTwo = gameLobby.addPlayer("player2", "Player2");
			const playerThree = gameLobby.addPlayer("player3", "Player3");

			gameLobby.removePlayerById(playerOne.id);

			expect(playerTwo.gamemaster).toBe(true);
			expect(playerThree.gamemaster).toBe(false);
		});
	});

	it("Retrieve all Players of a GameLobby", () => {
		const newPlayers: Player[] = [];
		for (let index = 0; index < 5; index++) {
			const player = gameLobby.addPlayer(`userId${index}`, `userName${index}`);
			newPlayers.push(player);
		}

		const gameLobbyAllPlayers = gameLobby.getAllPlayers();

		gameLobbyAllPlayers.forEach((player) => {
			expect(newPlayers).toContain(player);
		});
	});

	describe("Update Ready state of a Player", () => {
		it("If a Player sets his state to ready, his ready state, bet and suit betted on are updated", () => {
			const playerId = "playerId1";
			gameLobby.addPlayer(playerId, "Player1");

			const bet = 14;
			const bettedOnSuit = "hearts";
			gameLobby.updatePlayerReadyStateAndBet(playerId, true, bet, bettedOnSuit);

			const player = gameLobby.getPlayerById(playerId);

			expect(player?.ready).toBe(true);
			expect(player?.bet).toBe(bet);
			expect(player?.bettedOnSuit).toBe(bettedOnSuit);
		});

		it("Player cannot change his Ready state if a game is active", () => {
			gameLobby.addPlayer("playerId1", "Player1");
			gameLobby.addPlayer("playerId2", "Player2");

			gameLobby.updatePlayerReadyStateAndBet("playerId1", true, 14, "diamonds");
			gameLobby.updatePlayerReadyStateAndBet("playerId2", true, 4, "hearts");

			// Start the game
			gameLobby.drawNextCard();

			expect(() => {
				gameLobby.updatePlayerReadyStateAndBet("playerId2", false, undefined, undefined);
			}).toThrow(new InvalidActionError("You cannot change the ready state during an active game"));
		});

		it("Ready State of a Player that is not part of the GameLobby cannot be changed.", () => {
			gameLobby.addPlayer("playerId1", "Player1");

			expect(() => {
				gameLobby.updatePlayerReadyStateAndBet("playerId2", false, undefined, undefined);
			}).toThrow(InvalidActionError);
		});
	});

	describe("Start New Round", () => {
		it("When a new round is started, the Game is reset and each Players must first reapply their Ready state", () => {
			gameLobby.addPlayer("playerId1", "Player1");
			gameLobby.addPlayer("playerId2", "Player2");

			gameLobby.updatePlayerReadyStateAndBet("playerId1", true, 14, "diamonds");
			gameLobby.updatePlayerReadyStateAndBet("playerId2", true, 4, "hearts");

			// Finish the game

			while (!gameLobby.getGameLobbyInformation().currentGame.winner) {
				gameLobby.drawNextCard();
			}

			gameLobby.startNewRound();

			gameLobby.getGameLobbyInformation().players.forEach((player) => {
				expect(player.ready).toBe(false);
			});
			expect(gameLobby.getGameLobbyInformation().currentGame.gameState).toBe("waiting");
		});
	});

	describe("Draw next card (invalid actions)", () => {
		it("A card cannot be drawn until all Players who are in game are ready.", () => {
			gameLobby.addPlayer("playerId1", "Player1");
			gameLobby.addPlayer("playerId2", "Player2");

			gameLobby.updatePlayerReadyStateAndBet("playerId1", true, 14, "diamonds");

			expect(() => {
				gameLobby.drawNextCard();
			}).toThrow(
				new InvalidActionError(
					"All Players who are in the game (and not in the waiting room) must be ready to draw the next card"
				)
			);
		});

		it("If a player is in the waiting room, his ready state does not matter for the process of the game. Thefore a card can still be drawn.", () => {
			gameLobby.addPlayer("playerId1", "Player1");
			gameLobby.updatePlayerReadyStateAndBet("playerId1", true, 14, "diamonds");
			gameLobby.drawNextCard();
			gameLobby.drawNextCard();
			gameLobby.addPlayer("playerId2", "Player2");
			expect(() => {
				gameLobby.drawNextCard();
			}).not.toThrow();
		});
	});

	describe.skip("Game Statistic", () => {});
});
