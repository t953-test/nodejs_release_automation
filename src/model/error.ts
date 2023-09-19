import { RequestOptions } from '../request_options.js';
import { KaradenObject } from './karaden_object.js';

export class Error extends KaradenObject {
    public static readonly OBJECT_NAME = 'error';

    public constructor(id: any = null, requestOptions: RequestOptions | null = null) {
        super(id, requestOptions);
    }

    get code(): string {
        return this.getProperty('code');
    }

    get message(): string {
        return this.getProperty('message');
    }

    get errors(): KaradenObject {
        return this.getProperty('errors');
    }
}
