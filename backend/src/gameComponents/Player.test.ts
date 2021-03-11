import Player, { IPlayer, MAX_LENGTH_NAME, PlayerInfo } from "./Player";
import faker from "faker";
import InvalidInputError from "./Errors/InvalidInputError";

describe("Player Class", () => {
	describe("Create new Player", () => {
		it("Successfull creation of Player with Gameadmin rights", () => {
			const player = new Player("Test", "Hans", true);
			expect(player.id).toBe("Test");
			expect(player.name).toBe("Hans");
			expect(player.gamemaster).toBe(true);
		});

		it("If provided name exceeds maximal length, no player is created", () => {
			const randomString = faker.random.alphaNumeric(40);

			expect(() => {
				new Player(randomString, randomString, true);
			}).toThrow(InvalidInputError);
		});
	});

	// describe("Change Properties of Player", () => {
	// 	describe("suit", () => {
	// 		let player: IPlayer;
	// 		beforeEach(() => {
	// 			const player = new Player("Test", "Hans", true);
	// 		});

	// 	});
	// });

	describe("Retrieve Information about the Player", () => {
		let player: Player;

		beforeEach(() => {
			player = new Player("Test", "Hans", true);
		});

		it("No undefinied values returned", () => {
			const playerInfo = player.getPlayerInfo();

			Object.entries(playerInfo).forEach(([key, value]) => {
				expect(value).not.toBeUndefined();
				expect(value).not.toBeNull();
			});
		});
	});
});
