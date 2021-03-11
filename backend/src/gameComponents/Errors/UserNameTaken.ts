import { IErrorMessageForClient, PreciseErrorMessageForClient } from "./IErrorMessageForClient";

export default class UserNameTakenError extends Error implements IErrorMessageForClient {
	errMsgClient: PreciseErrorMessageForClient;
	constructor(message: string, errMsgClient?: PreciseErrorMessageForClient) {
		super(message);
		this.name = "UsernameTakenError";

		this.errMsgClient = {
			title: errMsgClient ? errMsgClient.title : message,
		};
		if (errMsgClient) {
			this.errMsgClient.description = errMsgClient.description;
		}
		Object.setPrototypeOf(this, UserNameTakenError.prototype);
	}
}
