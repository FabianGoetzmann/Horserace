import CardDeck, { ICardDeck, possibleSuits, possibleValues } from "./CardDeck";
import CardDeckError from "./Errors/CardDeckError";

describe("Test operations on CardDeck", () => {
	let cardDeck: ICardDeck;

	beforeEach(() => {
		cardDeck = new CardDeck();
		cardDeck.initialize();
	});

	describe("Get last drawn card", () => {
		it("If the deck has just been initialized, then no card was drawn", () => {
			const lastDrawnCard = cardDeck.getLastDrawnCard();
			expect(lastDrawnCard).toBeUndefined();
		});

		it("A card that has been drawn is stored as the last drawn card", () => {
			const drawnCard = cardDeck.drawCard();
			expect(drawnCard).toBe(cardDeck.lastDrawn);
		});

		it("Card Deck size decreases with each drawn card ", () => {
			const cardsInDeckBefore = cardDeck.deck.length;
			cardDeck.drawCard();
			expect(cardDeck.deck.length).toBe(cardsInDeckBefore - 1);
		});
	});

	it("After initialization the Card Deck is restored to initial state", () => {
		const amountCardsFreshDeck = possibleValues.length * possibleSuits.length;
		cardDeck.drawCard();
		cardDeck.initialize();

		expect(cardDeck.deck.length).toBe(amountCardsFreshDeck);
	});

	describe("Drawing Cards", () => {
		it("Drawing more cards than the deck contains is not possible", () => {
			let cardsInDeck = cardDeck.deck.length;
			while (cardsInDeck) {
				cardDeck.drawCard();
				cardsInDeck -= 1;
			}

			expect(() => {
				cardDeck.drawCard();
			}).toThrow(new CardDeckError("Empty Deck. Cannot draw any more cards."));
		});
	});
});
