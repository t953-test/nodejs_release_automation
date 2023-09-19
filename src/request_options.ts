import { KaradenObject } from './model/karaden_object.js';
import { Error } from './model/error.js';
import { InvalidRequestOptionsException } from './exception/invalid_request_options_exception.js';

export class RequestOptions {
    public constructor(
        public apiVersion?: string,
        public apiKey?: string,
        public tenantId?: string,
        public userAgent?: string,
        public apiBase?: string,
        public connectionTimeout?: number,
        public readTimeout?: number
    ) {}

    public merge(source: RequestOptions | null): RequestOptions {
        const destination = this.clone();

        if (source?.apiVersion) {
            destination.apiVersion = source.apiVersion;
        }
        if (source?.apiKey) {
            destination.apiKey = source.apiKey;
        }
        if (source?.tenantId) {
            destination.tenantId = source.tenantId;
        }
        if (source?.userAgent) {
            destination.userAgent = source.userAgent;
        }
        if (source?.apiBase) {
            destination.apiBase = source.apiBase;
        }
        if (source?.connectionTimeout) {
            destination.connectionTimeout = source.connectionTimeout;
        }
        if (source?.readTimeout) {
            destination.readTimeout = source.readTimeout;
        }

        return destination;
    }

    public getBaseUri(): string {
        return `${this.apiBase}/${this.tenantId}`;
    }

    protected validateApiVersion(): string[] {
        const messages: string[] = [];

        if (!this.apiVersion) {
            messages.push('apiVersionは必須です。');
            messages.push('文字列を入力してください。');
        }

        return messages;
    }

    protected validateApiKey(): string[] {
        const messages: string[] = [];

        if (!this.apiKey) {
            messages.push('apiKeyは必須です。');
            messages.push('文字列を入力してください。');
        }

        return messages;
    }

    protected validateTenantId(): string[] {
        const messages: string[] = [];

        if (!this.tenantId) {
            messages.push('tenantIdは必須です。');
            messages.push('文字列を入力してください。');
        }

        return messages;
    }

    protected validateApiBase(): string[] {
        const messages: string[] = [];

        if (!this.apiBase) {
            messages.push('apiBaseは必須です。');
            messages.push('文字列を入力してください。');
        }

        return messages;
    }

    public validate(): RequestOptions {
        const errors = new KaradenObject();
        let hasError = false;

        let messages = this.validateApiVersion();
        if (messages.length > 0) {
            errors.setProperty('apiVersion', messages);
            hasError = true;
        }

        messages = this.validateApiKey();
        if (messages.length > 0) {
            errors.setProperty('apiKey', messages);
            hasError = true;
        }

        messages = this.validateTenantId();
        if (messages.length > 0) {
            errors.setProperty('tenantId', messages);
            hasError = true;
        }

        messages = this.validateApiBase();
        if (messages.length > 0) {
            errors.setProperty('apiBase', messages);
            hasError = true;
        }

        if (hasError) {
            const error = new Error();
            error.setProperty('errors', errors);
            throw new InvalidRequestOptionsException(error);
        }

        return this;
    }

    public clone(): RequestOptions {
        const o = new (this.constructor as { new (): RequestOptions })();
        return Object.assign(o, this);
    }

    public static newBuilder(): RequestOptionsBuilder {
        return new RequestOptionsBuilder();
    }
}

export class RequestOptionsBuilder {
    protected requestOptions: RequestOptions;

    public constructor() {
        this.requestOptions = new RequestOptions();
    }

    public withApiVersion(apiVersion: string): RequestOptionsBuilder {
        this.requestOptions.apiVersion = apiVersion;
        return this;
    }

    public withApiKey(apiKey?: string): RequestOptionsBuilder {
        this.requestOptions.apiKey = apiKey;
        return this;
    }

    public withTenantId(tenantId?: string): RequestOptionsBuilder {
        this.requestOptions.tenantId = tenantId;
        return this;
    }

    public withUserAgent(userAgent?: string): RequestOptionsBuilder {
        this.requestOptions.userAgent = userAgent;
        return this;
    }

    public withApiBase(apiBase: string): RequestOptionsBuilder {
        this.requestOptions.apiBase = apiBase;
        return this;
    }

    public withConnectionTimeout(connectionTimeout: number): RequestOptionsBuilder {
        this.requestOptions.connectionTimeout = connectionTimeout;
        return this;
    }

    public withReadTimeout(readTimeout: number): RequestOptionsBuilder {
        this.requestOptions.readTimeout = readTimeout;
        return this;
    }

    public build(): RequestOptions {
        return this.requestOptions.clone();
    }
}
