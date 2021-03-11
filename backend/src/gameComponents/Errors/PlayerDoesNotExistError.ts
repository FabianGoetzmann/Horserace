export default class PlayerDoesNotExistError extends Error {
	title: string;
	constructor(message: string) {
		super();
		this.name = "PlayerDoesNotExistError";
		this.title = "Player does not exist";
		this.message = message;
	}
}
