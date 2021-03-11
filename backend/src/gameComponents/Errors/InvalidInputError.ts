import { IErrorMessageForClient, PreciseErrorMessageForClient } from "./IErrorMessageForClient";

export default class InvalidInputError extends Error implements IErrorMessageForClient {
	errMsgClient: string | PreciseErrorMessageForClient;
	constructor(message: string, errMsgClient?: PreciseErrorMessageForClient) {
		super(message);
		this.name = "InvalidInputError";

		this.errMsgClient = {
			title: errMsgClient ? errMsgClient.title : message,
		};
		if (errMsgClient) {
			this.errMsgClient.description = errMsgClient.description;
		}

		Object.setPrototypeOf(this, InvalidInputError.prototype);
	}
}
