import { Error } from '../../../model/error.js';
import { KaradenObject } from '../../../model/karaden_object.js';
import { InvalidParamsException } from '../../../exception/invalid_params_exception.js';
import { BulkMessageParams } from './bulk_message_params.js';
import * as fs from 'fs';

export class BulkMessageDownloadParams extends BulkMessageParams {
    protected static DEFAULT_MAX_RETRIES = 2;
    protected static MAX_MAX_RETRIES = 5;
    protected static MIN_MAX_RETRIES = 1;
    protected static DEFAULT_RETRY_INTERVAL = 20;
    protected static MAX_RETRY_INTERVAL = 60;
    protected static MIN_RETRY_INTERVAL = 10;

    public constructor(
        public id: string,
        public directoryPath: string,
        public maxRetries: number = BulkMessageDownloadParams.DEFAULT_MAX_RETRIES,
        public retryInterval: number = BulkMessageDownloadParams.DEFAULT_RETRY_INTERVAL
    ) {
        super();
    }

    protected validateid(): string[] {
        const messages: string[] = [];

        if (!this.id) {
            messages.push('idは必須です。');
            messages.push('文字列（UUID）を入力してください。');
        }

        return messages;
    }

    protected validateDirectoryPath(): string[] {
        const messages: string[] = [];

        if (!this.directoryPath) {
            messages.push('directoryPathは必須です。');
            messages.push('文字列を入力してください。');
        }

        if (!fs.existsSync(this.directoryPath)) {
            messages.push('指定されたディレクトリパスが存在しません。');
        } else {
            if (!fs.statSync(this.directoryPath).isDirectory()) {
                messages.push('指定されたパスはディレクトリではありません。');
            }
            if ((fs.statSync(this.directoryPath).mode & fs.constants.S_IRUSR) == 0) {
                messages.push('指定されたディレクトリには読み取り権限がありません。');
            }
            if ((fs.statSync(this.directoryPath).mode & fs.constants.S_IWUSR) == 0) {
                messages.push('指定されたディレクトリには書き込み権限がありません。');
            }
        }

        return messages;
    }

    protected validateMaxRetries(): string[] {
        const messages: string[] = [];

        if (
            !this.maxRetries ||
            !Number.isInteger(this.maxRetries) ||
            this.maxRetries < BulkMessageDownloadParams.MIN_MAX_RETRIES
        ) {
            messages.push(
                'maxRetriesには' + BulkMessageDownloadParams.MIN_MAX_RETRIES + '以上の整数を入力してください。'
            );
        }
        if (
            !this.maxRetries ||
            !Number.isInteger(this.maxRetries) ||
            this.maxRetries > BulkMessageDownloadParams.MAX_MAX_RETRIES
        ) {
            messages.push(
                'maxRetriesには' + BulkMessageDownloadParams.MAX_MAX_RETRIES + '以下の整数を入力してください。'
            );
        }

        return messages;
    }

    protected validateRetryInterval(): string[] {
        const messages: string[] = [];

        if (
            !this.retryInterval ||
            !Number.isInteger(this.retryInterval) ||
            this.retryInterval < BulkMessageDownloadParams.MIN_RETRY_INTERVAL
        ) {
            messages.push(
                'retryIntervalには' + BulkMessageDownloadParams.MIN_RETRY_INTERVAL + '以上の整数を入力してください。'
            );
        }
        if (
            !this.retryInterval ||
            !Number.isInteger(this.retryInterval) ||
            this.retryInterval > BulkMessageDownloadParams.MAX_RETRY_INTERVAL
        ) {
            messages.push(
                'retryIntervalには' + BulkMessageDownloadParams.MAX_RETRY_INTERVAL + '以下の整数を入力してください。'
            );
        }

        return messages;
    }

    public validate(): BulkMessageParams {
        const errors = new KaradenObject();
        let hasError = false;

        let messages = this.validateid();
        if (messages.length > 0) {
            errors.setProperty('id', messages);
            hasError = true;
        }

        messages = this.validateDirectoryPath();
        if (messages.length > 0) {
            errors.setProperty('directoryPath', messages);
            hasError = true;
        }

        messages = this.validateMaxRetries();
        if (messages.length > 0) {
            errors.setProperty('maxRetries', messages);
            hasError = true;
        }

        messages = this.validateRetryInterval();
        if (messages.length > 0) {
            errors.setProperty('retryInterval', messages);
            hasError = true;
        }

        if (hasError) {
            const error = new Error();
            error.setProperty('errors', errors);
            throw new InvalidParamsException(error);
        }

        return this;
    }

    public clone(): BulkMessageDownloadParams {
        const o = new (this.constructor as { new (): BulkMessageDownloadParams })();
        return Object.assign(o, this);
    }

    public static newBuilder(): BulkMessageDownloadParamsBuilder {
        return new BulkMessageDownloadParamsBuilder();
    }
}

export class BulkMessageDownloadParamsBuilder {
    protected params: BulkMessageDownloadParams;

    public constructor() {
        this.params = new BulkMessageDownloadParams('', '');
    }

    public withId(id: string): BulkMessageDownloadParamsBuilder {
        this.params.id = id;
        return this;
    }

    public withDirectoryPath(directoryPath: string): BulkMessageDownloadParamsBuilder {
        this.params.directoryPath = directoryPath;
        return this;
    }

    public withMaxRetries(maxRetries: number): BulkMessageDownloadParamsBuilder {
        this.params.maxRetries = maxRetries;
        return this;
    }

    public withRetryInterval(retryInterval: number): BulkMessageDownloadParamsBuilder {
        this.params.retryInterval = retryInterval;
        return this;
    }

    public build(): BulkMessageDownloadParams {
        return this.params.clone();
    }
}
