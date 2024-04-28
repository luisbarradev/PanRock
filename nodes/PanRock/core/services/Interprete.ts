import { IRequestOptions } from 'n8n-workflow';

export interface Option {
	description: string;
	value: string;
}

export abstract class Interprete<T> {
	constructor(
		protected request: (request: IRequestOptions) => Promise<T>,
		protected context: string,
		protected options: Option[],
	) {}
	abstract evaluate(msg: string): Promise<string>;
}
