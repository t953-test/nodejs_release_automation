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
import { ForbiddenException } from '../exception/forbidden_exception.js';
import { UnprocessableEntityException } from '../exception/unprocessable_entity_exception.js';
import { TooManyRequestsException } from '../exception/too_many_requests_exception.js';
import { UnknownErrorException } from '../exception/unknown_error_exception.js';
import { Response } from './response.interface.js';

export class AxiosResponse implements Response {
    protected static errorClasses: any[] = [
        BadRequestException,
        UnauthorizedException,
        NotFoundException,
        ForbiddenException,
        UnprocessableEntityException,
        TooManyRequestsException,
    ];

    protected _object: KaradenObject | null = null;
    protected _error: KaradenException | null = null;

    get isError(): boolean {
        return this.error !== null;
    }

    get error(): KaradenException | null {
        return this._error;
    }

    get object(): KaradenObject | null {
        return this._object;
    }

    public constructor(response: _AxiosResponse, requestOptions: RequestOptions) {
        this.interpret(response, requestOptions);
    }

    public interpret(response: _AxiosResponse, requestOptions: RequestOptions) {
        const statusCode = response.status;
        const body = response.data;
        let contents = null;
        try {
            contents = JSON.parse(body);
        } catch (e) {
            const headers = response.headers;
            this._error = new UnexpectedValueException(statusCode, headers, body);
            return;
        }

        const object = Utility.convertToKaradenObject(contents, requestOptions);
        if (200 > statusCode || 400 <= statusCode) {
            const headers = response.headers;
            this._error =
                object.object == 'error'
                    ? this.handleError(statusCode, headers, body, object as Error)
                    : new UnexpectedValueException(statusCode, headers, body);
        }

        this._object = object;
    }

    protected handleError(
        statusCode: number,
        headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
        body: string,
        error: Error
    ): KaradenException {
        const errorClass = AxiosResponse.errorClasses.find((klass: any) => klass.STATUS_CODE == statusCode);
        return errorClass
            ? new errorClass(headers, body, error)
            : new UnknownErrorException(statusCode, headers, body, error);
    }
}
