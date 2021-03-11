export type PreciseErrorMessageForClient = {
	title: string;
	description?: string;
};

export interface IErrorMessageForClient {
	errMsgClient: PreciseErrorMessageForClient | string;
}
