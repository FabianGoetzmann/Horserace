export default class NotAuthorizedError extends Error {
	title: string;
	constructor(message: string) {
		super();
		this.name = "NotAuthorizederror";
		this.title = "Only GameMaster is authorized to do this action.";
		this.message = message;
	}
}
