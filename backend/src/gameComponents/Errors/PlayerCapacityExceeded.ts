import { IErrorMessageForClient, PreciseErrorMessageForClient } from "./IErrorMessageForClient";

export default class PlayerCapacityExceeded extends Error implements IErrorMessageForClient {
	errMsgClient: PreciseErrorMessageForClient;
	constructor(message: string, errMsgClient?: PreciseErrorMessageForClient) {
		super(message);
		this.name = "PlayerCapacityExceeded";

		this.errMsgClient = {
			title: errMsgClient ? errMsgClient.title : message,
		};
		if (errMsgClient) {
			this.errMsgClient.description = errMsgClient.description;
		}
		Object.setPrototypeOf(this, PlayerCapacityExceeded.prototype);
	}
}
