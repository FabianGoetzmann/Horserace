export default class CardDeckError extends Error {
	target?: string;
	constructor(message: string, target?: string) {
		super(message);
		this.name = "CardDeckError";
		Object.setPrototypeOf(this, CardDeckError.prototype);
	}
}
