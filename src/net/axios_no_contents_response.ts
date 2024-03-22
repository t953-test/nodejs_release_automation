import { AxiosResponse as _AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { RequestOptions } from '../request_options.js';
import { UnexpectedValueException } from '../exception/unexpected_value_exception.js';
import { KaradenObject } from '../model/karaden_object.js';
import { KaradenException } from '../exception/karaden_exception.js';
import { Utility } from '../utility.js';
import { Error } from '../model/error';
import { BadRequestException } from '../exception/bad_request_exception.js';
import { UnauthorizedException } from '../exception/unauthorized_exception.js';
import { NotFoundException } from '../exception/not_found_exception.js';
import { NotImplementationException } from '../exception/not_implemention_exception.js';
import { ForbiddenException } from '../exception/forbidden_exception.js';
import { UnprocessableEntityException } from '../exception/unprocessable_entity_exception.js';
import { TooManyRequestsException } from '../exception/too_many_requests_exception.js';
import { UnknownErrorException } from '../exception/unknown_error_exception.js';
import { Response } from './response.interface.js';

export class AxiosNoContentsResponse implements Response {
    protected static errorClasses: any[] = [
        BadRequestException,
        UnauthorizedException,
        NotFoundException,
        ForbiddenException,
        UnprocessableEntityException,
        TooManyRequestsException,
    ];

    protected _error: KaradenException | null = null;
    protected _statusCode: number | null = null;
    protected _headers: any | null = null;

    get isError(): boolean {
        return this.error !== null;
    }

    get error(): KaradenException | null {
        return this._error;
    }

    get object(): KaradenObject | null {
        throw new NotImplementationException();
    }

    get statusCode(): number | null {
        return this._statusCode;
    }

    get headers(): any | null {
        return this._headers;
    }

    public constructor(response: _AxiosResponse, requestOptions: RequestOptions) {
        this.interpret(response, requestOptions);
    }

    public interpret(response: _AxiosResponse, requestOptions: RequestOptions) {
        this._statusCode = response.status;
        this._headers = response.headers;
        if (400 <= this._statusCode) {
            const body = response.data;
            let contents = null;
            try {
                contents = JSON.parse(body);
            } catch (e) {
                const headers = response.headers;
                this._error = new UnexpectedValueException(this._statusCode, headers, body);
                return;
            }
            const object = Utility.convertToKaradenObject(contents, requestOptions);
            const headers = response.headers;
            this._error =
                object.object == 'error'
                    ? this.handleError(this._statusCode, headers, body, object as Error)
                    : new UnexpectedValueException(this._statusCode, headers, body);
        }
    }

    protected handleError(
        statusCode: number,
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
        body: string,
        error: Error
    ): KaradenException {
        const errorClass = AxiosNoContentsResponse.errorClasses.find((klass: any) => klass.STATUS_CODE == statusCode);
        return errorClass
            ? new errorClass(headers, body, error)
            : new UnknownErrorException(statusCode, headers, body, error);
    }
}
