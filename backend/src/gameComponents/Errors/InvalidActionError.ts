export default class InvalidActionError extends Error {
	target?: string;
	constructor(message: string, target?: string) {
		super(message);
		this.name = "InvalidActionError";
		if (target) {
			this.target = target;
		}
		Object.setPrototypeOf(this, InvalidActionError.prototype);
	}
}
