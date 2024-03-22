import { RequestOptions } from '../request_options.js';
import { Error } from './error.js';
import { KaradenObject } from './karaden_object.js';
import { Requestable } from './requestable.js';
import { BulkMessageCreateParams } from '../param/message/bulk/bulk_message_create_params.js';
import { BulkMessageListMessageParams } from '../param/message/bulk/bulk_message_list_message_params.js';
import { BulkMessageShowParams } from '../param/message/bulk/bulk_message_show_params.js';
import { BulkMessageParams } from '../param/message/bulk/bulk_message_params.js';
import { Response } from '../net/response.interface.js';

export const BulkMessageStatus = {
    Done: 'done',
    Waiting: 'waiting',
    Processing: 'processing',
    Error: 'error',
} as const;
export type BulkMessageStatus = (typeof BulkMessageStatus)[keyof typeof BulkMessageStatus];

export class BulkMessage extends Requestable {
    public static readonly OBJECT_NAME = 'bulk_message';

    public get status(): BulkMessageStatus {
        return this.getProperty('status');
    }

    public get error(): Error | null {
        return this.getProperty('error');
    }

    public get createdAt(): Date {
        const createdAt = this.getProperty('created_at');
        return new Date(createdAt);
    }

    public get updatedAt(): Date {
        const updatedAt = this.getProperty('updated_at');
        return new Date(updatedAt);
    }

    protected static async validate(params: BulkMessageParams): Promise<BulkMessage> {
        return new Promise<BulkMessage>((resolve, reject) => {
            try {
                params.validate();
                resolve(new BulkMessage());
            } catch (e) {
                reject(e);
            }
        });
    }

    public static async create(
        params: BulkMessageCreateParams,
        requestOptions: RequestOptions | null = null
    ): Promise<BulkMessage> {
        return this.validate(params).then(() =>
            this.request(
                'POST',
                params.toPath(),
                'application/x-www-form-urlencoded',
                null,
                params.toData(),
                requestOptions
            ).then((value: KaradenObject) => value as BulkMessage)
        );
    }
    public static async show(
        params: BulkMessageShowParams,
        requestOptions: RequestOptions | null = null
    ): Promise<BulkMessage> {
        return this.validate(params).then(() =>
            this.request('GET', params.toPath(), null, null, null, requestOptions).then(
                (value: KaradenObject) => value as BulkMessage
            )
        );
    }

    public static async listMessage(
        params: BulkMessageListMessageParams,
        requestOptions: RequestOptions | null = null
    ): Promise<string | null> {
        return this.validate(params).then(() =>
            this.requestAndReturnResponseInterface('GET', params.toPath(), null, null, null, requestOptions).then(
                (value: Response) => (value.statusCode == 302 ? value.headers.location : null)
            )
        );
    }
}
