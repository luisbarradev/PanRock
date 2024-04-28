import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	NodeExecutionWithMetadata,
} from 'n8n-workflow';
import { OpenAiInterprete } from './core/impl/OpenAIInterprete';

export class PanRock implements INodeType {
	constructor() {}
	description: INodeTypeDescription = {
		displayName: 'PanRock',
		name: 'panRock',
		icon: 'file:panrockpics.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Hola Mundo! PanRock esta inspirado en AWS BedRock Pan viene de Pancho :)',
		defaults: {
			name: 'PanRock',
		},
		credentials: [
			{
				name: 'openai_api',
				required: true,
			},
		],
		inputNames: ['Mensaje'],
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Mensaje',
				name: 'message',
				default: '',
				type: 'string',
				required: true,
				description: 'Mensaje que se evaluara',
			},
			{
				displayName: 'Contexto',
				name: 'context',
				default: '',
				type: 'string',
				required: true,
				description: 'Contexto que se evaluara',
				typeOptions: {
					rows: 4,
				},
			},
			{
				displayName: 'Salidas',
				name: 'outputs',
				placeholder: 'Salidas',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'output',
						displayName: 'Salida',
						values: [
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: 'Descripción del evento',
							},
							{
								displayName: 'Valor',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Valor de salida',
							},
						],
					},
				],
			},
		],
	};

	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const msg = this.getNodeParameter('message' as any) as string;
		const context = this.getNodeParameter('context' as any) as string;
		const outputs = this.getNodeParameter('outputs' as any) as unknown as {
			output: {
				description: string;
				value: string;
			}[];
		};

		const interprete = new OpenAiInterprete(
			(request: IRequestOptions) =>
				this.helpers.requestWithAuthentication.call(this, 'openai_api', request),
			context,
			outputs.output,
		);
		const result = await interprete.evaluate(msg);

		return [
			this.helpers.returnJsonArray({
				result,
			}),
		];
	}
}
