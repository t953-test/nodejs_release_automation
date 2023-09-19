import { MessageCancelParams } from '../param/message/message_cancel_params.js';
import { MessageCreateParams } from '../param/message/message_create_params.js';
import { MessageDetailParams } from '../param/message/message_detail_params.js';
import { MessageListParams } from '../param/message/message_list_params.js';
import { MessageParams } from '../param/message/message_params.js';
import { RequestOptions } from '../request_options.js';
import { Collection } from './collection.js';
import { KaradenObject } from './karaden_object.js';
import { Requestable } from './requestable.js';

export const Result = {
    Done: 'done',
    Processing: 'processing',
} as const;
export type Result = (typeof Result)[keyof typeof Result];

export const Status = {
    Done: 'done',
    Waiting: 'waiting',
    Error: 'error',
    Canceled: 'canceled',
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export const SentResult = {
    None: 'none',
    Received: 'received',
    Unconnected: 'unconnected',
    Error: 'error',
    Unknown: 'unknown',
} as const;
export type SentResult = (typeof SentResult)[keyof typeof SentResult];

export const Carrier = {
    Docomo: 'docomo',
    Softbank: 'softbank',
    Au: 'au',
    Rakuten: 'rakuten',
    Option: 'option',
    International: 'international',
    Checking: 'checking',
    Unknown: 'unknown',
} as const;
export type Carrier = (typeof Carrier)[keyof typeof Carrier];

export class Message extends Requestable {
    public static readonly OBJECT_NAME = 'message';

    public get serviceId(): number {
        return this.getProperty('service_id');
    }

    public get billingAddressId(): number {
        return this.getProperty('billing_address_id');
    }

    public get to(): string {
        return this.getProperty('to');
    }

    public get body(): string {
        return this.getProperty('body');
    }

    public get tags(): string[] {
        return this.getProperty('tags');
    }

    public get isShorten(): boolean {
        return this.getProperty('is_shorten');
    }

    public get result(): Result {
        return this.getProperty('result');
    }

    public get status(): Status {
        return this.getProperty('status');
    }

    public get sentResult(): SentResult {
        return this.getProperty('sent_result');
    }

    public get carrier(): Carrier {
        return this.getProperty('carrier');
    }

    public get chargedCountPerSent(): number {
        return this.getProperty('charged_count_per_sent');
    }

    public get scheduledAt(): Date {
        const scheduledAt = this.getProperty('scheduled_at');
        return new Date(scheduledAt);
    }

    public get limitedAt(): Date {
        const limitedAt = this.getProperty('limited_at');
        return new Date(limitedAt);
    }

    public get sentAt(): Date {
        const sentAt = this.getProperty('sent_at');
        return new Date(sentAt);
    }

    public get receivedAt(): Date {
        const receivedAt = this.getProperty('received_at');
        return new Date(receivedAt);
    }

    public get chargedAt(): Date {
        const chargedAt = this.getProperty('charged_at');
        return new Date(chargedAt);
    }

    public get createdAt(): Date {
        const createdAt = this.getProperty('created_at');
        return new Date(createdAt);
    }

    public get updatedAt(): Date {
        const updatedAt = this.getProperty('updated_at');
        return new Date(updatedAt);
    }

    protected static async validate(params: MessageParams): Promise<Message> {
        return new Promise<Message>((resolve, reject) => {
            try {
                params.validate();
                resolve(new Message());
            } catch (e) {
                reject(e);
            }
        });
    }

    public static async create(params: MessageCreateParams, requestOptions: RequestOptions): Promise<Message> {
        return this.validate(params).then(() =>
            this.request(
                'POST',
                params.toPath(),
                'application/x-www-form-urlencoded',
                null,
                params.toData(),
                requestOptions
            ).then((value: KaradenObject) => value as Message)
        );
    }

    public static async detail(params: MessageDetailParams, requestOptions: RequestOptions): Promise<Message> {
        return this.validate(params).then(() =>
            this.request('GET', params.toPath(), null, null, null, requestOptions).then(
                (value: KaradenObject) => value as Message
            )
        );
    }

    public static async list(params: MessageListParams, requestOptions: RequestOptions): Promise<Collection> {
        return this.validate(params).then(() =>
            this.request('GET', params.toPath(), null, params.toParams(), null, requestOptions).then(
                (value: KaradenObject) => value as Collection
            )
        );
    }

    public static cancel(params: MessageCancelParams, requestOptions: RequestOptions): Promise<Message> {
        return this.validate(params).then(() =>
            this.request('POST', params.toPath(), null, null, null, requestOptions).then(
                (value: KaradenObject) => value as Message
            )
        );
    }
}
