export interface Response {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Choice[];
	usage: Usage;
	system_fingerprint: string;
}

export interface Choice {
	index: number;
	message: Message;
	logprobs: any;
	finish_reason: string;
}

export interface Message {
	role: string;
	content: any;
	tool_calls: ToolCall[];
}

export interface ToolCall {
	id: string;
	type: string;
	function: Function;
}

export interface Function {
	name: string;
	arguments: string;
}

export interface Usage {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
}
