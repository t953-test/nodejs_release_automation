import { Error } from '../../../model/error.js';
import { KaradenObject } from '../../../model/karaden_object.js';
import { InvalidParamsException } from '../../../exception/invalid_params_exception.js';
import { BulkMessageParams } from './bulk_message_params.js';

export type BulkMessageCreateParamsData = {
    bulk_file_id: string;
};

export class BulkMessageCreateParams extends BulkMessageParams {
    public constructor(public bulkFileId: string) {
        super();
    }

    public toPath(): string {
        return BulkMessageParams.CONTEXT_PATH;
    }

    public toData(): BulkMessageCreateParamsData {
        return {
            bulk_file_id: this.bulkFileId,
        };
    }

    protected validateBulkFileId(): string[] {
        const messages: string[] = [];

        if (!this.bulkFileId) {
            messages.push('bulkFileIdは必須です。');
            messages.push('文字列（UUID）を入力してください。');
        }

        return messages;
    }

    public validate(): BulkMessageParams {
        const errors = new KaradenObject();
        let hasError = false;

        const messages = this.validateBulkFileId();
        if (messages.length > 0) {
            errors.setProperty('bulkFileId', messages);
            hasError = true;
        }

        if (hasError) {
            const error = new Error();
            error.setProperty('errors', errors);
            throw new InvalidParamsException(error);
        }

        return this;
    }

    public clone(): BulkMessageCreateParams {
        const o = new (this.constructor as { new (): BulkMessageCreateParams })();
        return Object.assign(o, this);
    }

    public static newBuilder(): BulkMessageCreateParamsBuilder {
        return new BulkMessageCreateParamsBuilder();
    }
}

export class BulkMessageCreateParamsBuilder {
    protected params: BulkMessageCreateParams;

    public constructor() {
        this.params = new BulkMessageCreateParams('');
    }

    public withBulkFileId(bulkFileId: string): BulkMessageCreateParamsBuilder {
        this.params.bulkFileId = bulkFileId;
        return this;
    }

    public build(): BulkMessageCreateParams {
        return this.params.clone();
    }
}
