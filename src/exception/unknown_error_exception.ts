import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { Error } from '../model/error.js';
import { KaradenException } from './karaden_exception.js';

export class UnknownErrorException extends KaradenException {
    public constructor(
        public statusCode: number,
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
        body: string,
        error: Error
    ) {
        super(headers, body, error);
    }
}
