import { possibleSuits, possibleValues } from "./CardDeck";
import Game, { IGame, POSITIONS_REQUIRED_FOR_WIN } from "./Game";

describe("Game Class", () => {
	describe("Test initialization", () => {
		it("Correct initialization of Game Class", () => {
			const game = new Game();

			expect(game.state).toBe("waiting");
			expect(game.positionRequiredForWin).toBe(POSITIONS_REQUIRED_FOR_WIN);
			expect(game.racetrack).not.toBeUndefined();
			expect(game.cardDeck).not.toBeUndefined();
			expect(game.cardDeck.deck.length).toBeGreaterThan(0);
		});
	});

	let game: IGame;

	beforeEach(() => {
		game = new Game();
	});

	describe("Draw new card", () => {
		it("A card can be drawn if a game has not been finished ", () => {
			const amountCardsBeforeMove = game.cardDeck.deck.length;
			game.nextMove();

			expect(game.cardDeck.deck.length).toBe(amountCardsBeforeMove - 1);
		});

		it("When a winner is determined, the game is finished", () => {
			let winner;
			while (!winner) {
				winner = game.nextMove();
			}

			expect(game.winner).toBe(winner);
			expect(game.state).toBe("finished");
		});
	});

	describe("Start new game", () => {
		beforeEach(() => {
			// First Round
			let winner;
			while (!winner) {
				winner = game.nextMove();
			}
			// New round
			game.initializeNewGame();
		});

		it("State of the game is 'waiting' after a new game was started", () => {
			expect(game.state).toBe("waiting");
		});
		it("All Suit Positions are resetted to 0", () => {
			Object.entries(game.racetrack.getPositions()).forEach(([key, val]) => {
				expect(val).toBe(0);
			});
		});

		it("Card deck was reseted", () => {
			const flippedCardsCount = Object.keys(game.racetrack.flipFalteringCard).length - length;
			expect(game.cardDeck.deck.length).toBe(possibleSuits.length * possibleValues.length - flippedCardsCount);
		});
	});

	describe("Retrieve information about the game", () => {
		it("After a card has been drawn it is contained in the game information", () => {
			const lastDrawnCard = game.cardDeck.lastDrawn;

			expect(game.getGameInfo().lastDrawnCard).toBe(lastDrawnCard);
		});

		it("After the game is finished, the winner is contained in the game information", () => {
			let winner;
			while (!winner) {
				winner = game.nextMove();
			}

			expect(game.winner).toBe(winner);
		});

		it("No undefinied values returned", () => {
			Object.entries(game).forEach(([key, value]) => {
				expect(value).not.toBeUndefined();
				expect(value).not.toBeNull();
			});
		});
	});
});
