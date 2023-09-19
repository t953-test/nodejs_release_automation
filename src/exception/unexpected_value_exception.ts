import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { KaradenException } from './karaden_exception.js';

export class UnexpectedValueException extends KaradenException {
    public constructor(
        public statusCode: number,
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
        body: string
    ) {
        super(headers, body);
    }
}
