import { InvalidParamsException } from '../../exception/invalid_params_exception.js';
import { Error } from '../../model/error.js';
import { KaradenObject } from '../../model/karaden_object.js';
import { Utility } from '../../utility.js';
import { MessageParams } from './message_params.js';

export type MessageCreateParamsData = {
    service_id: number;
    to: string;
    body: string;
    tags?: string[];
    is_shorten?: string;
    scheduled_at?: string;
    limited_at?: string;
};

export class MessageCreateParams extends MessageParams {
    public constructor(
        public serviceId: number,
        public to: string,
        public body: string,
        public tags?: string[],
        public isShorten?: boolean,
        public scheduledAt?: Date,
        public limitedAt?: Date
    ) {
        super();
    }

    public toPath(): string {
        return MessageCreateParams.CONTEXT_PATH;
    }

    public toData(): MessageCreateParamsData {
        return {
            service_id: this.serviceId,
            to: this.to,
            body: this.body,
            tags: this.tags,
            is_shorten: typeof this.isShorten == 'boolean' ? this.isShorten.toString() : undefined,
            scheduled_at: this.scheduledAt ? Utility.toISOString(this.scheduledAt) : undefined,
            limited_at: this.limitedAt ? Utility.toISOString(this.limitedAt) : undefined,
        };
    }

    protected validateServiceId(): string[] {
        const messages: string[] = [];

        if (!this.serviceId || this.serviceId <= 0) {
            messages.push('serviceIdは必須です。');
            messages.push('数字を入力してください。');
        }

        return messages;
    }

    protected validateTo(): string[] {
        const messages: string[] = [];

        if (!this.to) {
            messages.push('toは必須です。');
            messages.push('文字列を入力してください。');
        }

        return messages;
    }

    protected validateBody(): string[] {
        const messages: string[] = [];

        if (!this.body) {
            messages.push('bodyは必須です。');
            messages.push('文字列を入力してください。');
        }

        return messages;
    }

    public validate(): MessageParams {
        const errors = new KaradenObject();
        let hasError = false;

        let messages = this.validateServiceId();
        if (messages.length > 0) {
            errors.setProperty('serviceId', messages);
            hasError = true;
        }

        messages = this.validateTo();
        if (messages.length > 0) {
            errors.setProperty('to', messages);
            hasError = true;
        }

        messages = this.validateBody();
        if (messages.length > 0) {
            errors.setProperty('body', messages);
            hasError = true;
        }

        if (hasError) {
            const error = new Error();
            error.setProperty('errors', errors);
            throw new InvalidParamsException(error);
        }

        return this;
    }

    public clone(): MessageCreateParams {
        const o = new (this.constructor as { new (): MessageCreateParams })();
        return Object.assign(o, this);
    }

    public static newBuilder(): MessageCreateParamsBuilder {
        return new MessageCreateParamsBuilder();
    }
}

export class MessageCreateParamsBuilder {
    protected params: MessageCreateParams;

    public constructor() {
        this.params = new MessageCreateParams(0, '', '');
    }

    public withServiceId(serviceId: number): MessageCreateParamsBuilder {
        this.params.serviceId = serviceId;
        return this;
    }

    public withTo(to: string): MessageCreateParamsBuilder {
        this.params.to = to;
        return this;
    }

    public withBody(body: string): MessageCreateParamsBuilder {
        this.params.body = body;
        return this;
    }

    public withTags(tags: string[]): MessageCreateParamsBuilder {
        this.params.tags = tags;
        return this;
    }

    public withIsShorten(isShorten: boolean): MessageCreateParamsBuilder {
        this.params.isShorten = isShorten;
        return this;
    }

    public withScheduledAt(scheduledAt: Date): MessageCreateParamsBuilder {
        this.params.scheduledAt = scheduledAt;
        return this;
    }

    public withLimitedAt(limitedAt: Date): MessageCreateParamsBuilder {
        this.params.limitedAt = limitedAt;
        return this;
    }

    public build(): MessageCreateParams {
        return this.params.clone();
    }
}
