import { Error } from '../../../model/error.js';
import { KaradenObject } from '../../../model/karaden_object.js';
import { InvalidParamsException } from '../../../exception/invalid_params_exception.js';
import { BulkMessageParams } from './bulk_message_params.js';

export class BulkMessageShowParams extends BulkMessageParams {
    public constructor(public id: string) {
        super();
    }

    public toPath(): string {
        return `${BulkMessageParams.CONTEXT_PATH}/${this.id}`;
    }

    protected validateid(): string[] {
        const messages: string[] = [];

        if (!this.id) {
            messages.push('idは必須です。');
            messages.push('文字列（UUID）を入力してください。');
        }

        return messages;
    }

    public validate(): BulkMessageParams {
        const errors = new KaradenObject();
        let hasError = false;

        const messages = this.validateid();
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

    public clone(): BulkMessageShowParams {
        const o = new (this.constructor as { new (): BulkMessageShowParams })();
        return Object.assign(o, this);
    }

    public static newBuilder(): BulkMessageShowParamsBuilder {
        return new BulkMessageShowParamsBuilder();
    }
}

export class BulkMessageShowParamsBuilder {
    protected params: BulkMessageShowParams;

    public constructor() {
        this.params = new BulkMessageShowParams('');
    }

    public withId(id: string): BulkMessageShowParamsBuilder {
        this.params.id = id;
        return this;
    }

    public build(): BulkMessageShowParams {
        return this.params.clone();
    }
}
