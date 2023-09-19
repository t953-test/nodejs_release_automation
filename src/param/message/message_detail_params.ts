import { InvalidParamsException } from '../../exception/invalid_params_exception.js';
import { Error } from '../../model/error.js';
import { KaradenObject } from '../../model/karaden_object.js';
import { MessageParams } from './message_params.js';

export class MessageDetailParams extends MessageParams {
    public constructor(public id: string) {
        super();
    }

    public toPath(): string {
        return `${MessageDetailParams.CONTEXT_PATH}/${this.id}`;
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

    public clone(): MessageDetailParams {
        const o = new (this.constructor as { new (): MessageDetailParams })();
        return Object.assign(o, this);
    }

    public static newBuilder(): MessageDetailParamsBuilder {
        return new MessageDetailParamsBuilder();
    }
}

export class MessageDetailParamsBuilder {
    protected params: MessageDetailParams;

    public constructor() {
        this.params = new MessageDetailParams('');
    }

    public withId(id: string): MessageDetailParamsBuilder {
        this.params.id = id;
        return this;
    }

    public build(): MessageDetailParams {
        return this.params.clone();
    }
}
