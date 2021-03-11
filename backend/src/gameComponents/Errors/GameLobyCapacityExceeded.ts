import { IErrorMessageForClient, PreciseErrorMessageForClient } from "./IErrorMessageForClient";

export default class GameLobyCapacityExceeded extends Error implements IErrorMessageForClient {
	errMsgClient: PreciseErrorMessageForClient;
	constructor(message: string, errMsgClient?: PreciseErrorMessageForClient) {
		super(message);
		this.name = "GameLobyCapacityExceeded";

		this.errMsgClient = {
			title: errMsgClient ? errMsgClient.title : message,
		};
		if (errMsgClient) {
			this.errMsgClient.description = errMsgClient.description;
		}

		Object.setPrototypeOf(this, GameLobyCapacityExceeded.prototype);
	}
}
