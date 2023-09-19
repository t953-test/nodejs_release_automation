import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { Error as ErrorDetail } from '../model/error.js';

export class KaradenException extends Error {
    constructor(
        public headers: RawAxiosResponseHeaders | AxiosResponseHeaders | null = null,
        public body: string | null = null,
        public error?: ErrorDetail
    ) {
        super();
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
