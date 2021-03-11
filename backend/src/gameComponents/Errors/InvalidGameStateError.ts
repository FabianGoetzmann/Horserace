export default class InvalidGameStateError extends Error {
	title: string;
	constructor(message: string) {
		super();
		this.name = "InvalidGameStateError";
		this.title = "Invalid Game State";
		this.message = message;
	}
}
