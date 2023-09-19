import { InvalidParamsException } from '../../exception/invalid_params_exception.js';
import { Error } from '../../model/error.js';
import { KaradenObject } from '../../model/karaden_object.js';
import { MessageParams } from './message_params.js';

export class MessageCancelParams extends MessageParams {
    public constructor(public id: string) {
        super();
    }

    public toPath(): string {
        return `${MessageCancelParams.CONTEXT_PATH}/${this.id}/cancel`;
    }

    protected validateId(): string[] {
        const messages: string[] = [];

        if (!this.id) {
            messages.push('idは必須です。');
            messages.push('文字列（UUID）を入力してください。');
        }

        return messages;
    }

    public validate(): MessageParams {
        const errors = new KaradenObject();
        let hasError = false;

        const messages = this.validateId();
        if (messages.length > 0) {
            errors.setProperty('id', messages);
            hasError = true;
        }

        if (hasError) {
            const error = new Error();
            error.setProperty('errors', errors);
            throw new InvalidParamsException(error);
        }

        return this;
    }

    public clone(): MessageCancelParams {
        const o = new (this.constructor as { new (): MessageCancelParams })();
        return Object.assign(o, this);
    }

    public static newBuilder(): MessageCancelParamsBuilder {
        return new MessageCancelParamsBuilder();
    }
}

export class MessageCancelParamsBuilder {
    protected params: MessageCancelParams;

    public constructor() {
        this.params = new MessageCancelParams('');
    }

    public withId(id: string): MessageCancelParamsBuilder {
        this.params.id = id;
        return this;
    }

    public build(): MessageCancelParams {
        return this.params.clone();
    }
}
