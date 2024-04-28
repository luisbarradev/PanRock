import { IRequestOptions } from 'n8n-workflow';
import { Interprete, Option } from '../services/Interprete';
import { Response } from './OpenAiTypes';

export class OpenAiInterprete extends Interprete<Response> {
	getTool(options: Option[], msg: string) {
		const enumOptions = options.map((option) => option.value.toUpperCase());

		const description = options
			.map((option) => `${option.description}: ${option.value.toUpperCase()}`)
			.join('\n');

		const tools = [
			{
				type: 'function',
				function: {
					name: 'get_next_flow',
					description:
						'Get the next flow, ' + description + 'UNKNOWN: there is no certainty of the flow',
					parameters: {
						type: 'object',
						properties: {
							flow: {
								type: 'string',
								description: 'flow name',
								enum: [...enumOptions, 'UNKNOWN'],
							},
						},
						required: ['location'],
					},
				},
			},
		];
		return tools;
	}

	async evaluate(msg: string): Promise<string> {
		const request: IRequestOptions = {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			uri: 'https://api.openai.com/v1/chat/completions',
			body: {
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: this.context },
					{ role: 'user', content: msg },
				],
				tools: this.getTool(this.options, msg),
				temperature: 0.5,
			},
			json: true,
		};
		const data = await this.request(request);
		try {
			const flow = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
			return JSON.parse(flow)?.flow ?? 'UNKNOWN';
		} catch (e) {
			return 'UNKNOWN';
		}
	}
}
