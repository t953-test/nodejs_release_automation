import { Result, SentResult, Status } from '../../model/message.js';
import { Utility } from '../../utility.js';
import { MessageParams } from './message_params.js';

export type MessageListParamsParams = {
    service_id?: number;
    to?: string;
    status?: Status;
    result?: Result;
    sent_result?: SentResult;
    tag?: string;
    start_at?: string;
    end_at?: string;
    page?: number;
    per_page?: number;
};

export class MessageListParams extends MessageParams {
    public constructor(
        public serviceId?: number,
        public to?: string,
        public status?: Status,
        public result?: Result,
        public sentResult?: SentResult,
        public tag?: string,
        public startAt?: Date,
        public endAt?: Date,
        public page?: number,
        public perPage?: number
    ) {
        super();
    }

    public toPath(): string {
        return MessageListParams.CONTEXT_PATH;
    }

    public toParams(): MessageListParamsParams {
        return {
            service_id: this.serviceId,
            to: this.to,
            status: this.status,
            result: this.result,
            sent_result: this.sentResult,
            tag: this.tag,
            start_at: this.startAt ? Utility.toISOString(this.startAt!) : undefined,
            end_at: this.endAt ? Utility.toISOString(this.endAt) : undefined,
            page: this.page,
            per_page: this.perPage,
        };
    }

    public clone(): MessageListParams {
        const o = new (this.constructor as { new (): MessageListParams })();
        return Object.assign(o, this);
    }

    public static newBuilder(): MessageListParamsBuilder {
        return new MessageListParamsBuilder();
    }
}

export class MessageListParamsBuilder {
    protected params: MessageListParams;

    public constructor() {
        this.params = new MessageListParams();
    }

    public withServiceId(serviceId: number): MessageListParamsBuilder {
        this.params.serviceId = serviceId;
        return this;
    }

    public withTo(to: string): MessageListParamsBuilder {
        this.params.to = to;
        return this;
    }

    public withStatus(status: Status): MessageListParamsBuilder {
        this.params.status = status;
        return this;
    }

    public withResult(result: Result): MessageListParamsBuilder {
        this.params.result = result;
        return this;
    }

    public withSentResult(sentResult: SentResult): MessageListParamsBuilder {
        this.params.sentResult = sentResult;
        return this;
    }

    public withTag(tag: string): MessageListParamsBuilder {
        this.params.tag = tag;
        return this;
    }

    public withStartAt(startAt: Date): MessageListParamsBuilder {
        this.params.startAt = startAt;
        return this;
    }

    public withEndAt(endAt: Date): MessageListParamsBuilder {
        this.params.endAt = endAt;
        return this;
    }

    public withPage(page: number): MessageListParamsBuilder {
        this.params.page = page;
        return this;
    }

    public withPerPage(perPage: number): MessageListParamsBuilder {
        this.params.perPage = perPage;
        return this;
    }

    public build(): MessageListParams {
        return this.params.clone();
    }
}
