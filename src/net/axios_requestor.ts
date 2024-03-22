import * as os from 'os';
import axios, { AxiosRequestConfig, AxiosResponse as _AxiosResponse } from 'axios';
import { Config } from '../config.js';
import { RequestOptions } from '../request_options.js';
import { AxiosNoContentsResponse } from './axios_no_contents_response.js';
import { AxiosResponse } from './axios_response.js';
import { Response } from './response.interface.js';
import { Requestor } from './requestor.interface.js';

export class AxiosRequestor implements Requestor {
    protected static DEFAULT_USER_AGENT = 'Karaden/Node/';
    protected static DEFAULT_MAX_REDIRECTA = 5;

    public invoke(
        method: string,
        path: string,
        contentType: string | null = null,
        params: any = null,
        data: any = null,
        requestOptions: RequestOptions | null = null,
        isNoContents: boolean | null = false,
        allowRedirects: boolean | null = true
    ): Promise<Response> {
        requestOptions = Config.asRequestOptions().merge(requestOptions);
        requestOptions.validate();

        const maxRedirects = allowRedirects ? AxiosRequestor.DEFAULT_MAX_REDIRECTA : 0;
        const config: AxiosRequestConfig = {
            url: path,
            method: method,
            baseURL: requestOptions.getBaseUri(),
            headers: {
                'User-Agent': this.buildUserAgent(requestOptions),
                'Karaden-Client-User-Agent': this.buildClientUserAgent(),
                'Karaden-Version': requestOptions.apiVersion,
                'Content-Type': contentType,
                Authorization: `Bearer ${requestOptions.apiKey}`,
            },
            data: this.buildBody(data),
            params: this.buildQuery(params),
            validateStatus: () => true,
            responseType: 'text',
            maxRedirects: maxRedirects,
        };
        return axios(config).then((response: _AxiosResponse) =>
            !isNoContents
                ? new AxiosResponse(response, requestOptions!)
                : new AxiosNoContentsResponse(response, requestOptions!)
        );
    }

    protected buildQuery(params: any): URLSearchParams | undefined {
        let query: URLSearchParams | undefined = undefined;
        if (params) {
            query = new URLSearchParams();
            Object.getOwnPropertyNames(params)
                .filter((key: string) => params[key] !== undefined)
                .forEach((key: string) => {
                    if (params[key] instanceof Array) {
                        params[key].forEach((value: any, i: number) => query!.append(`${key}[${i}]`, value));
                    } else {
                        query!.append(key, params[key]);
                    }
                });
        }
        return query;
    }

    protected buildBody(data: any): URLSearchParams | undefined {
        let body: URLSearchParams | undefined = undefined;
        if (data) {
            body = new URLSearchParams();
            Object.getOwnPropertyNames(data)
                .filter((key: string) => data[key] !== undefined)
                .forEach((key: string) => {
                    if (data[key] instanceof Array) {
                        data[key].forEach((value: any, i: number) => body!.append(`${key}[${i}]`, value));
                    } else {
                        body!.append(key, data[key]);
                    }
                });
        }
        return body;
    }

    protected buildUserAgent(requestOptions: RequestOptions): string {
        return requestOptions.userAgent ? requestOptions.userAgent : AxiosRequestor.DEFAULT_USER_AGENT + Config.VERSION;
    }

    protected buildClientUserAgent(): string {
        return JSON.stringify({
            bindings_version: Config.VERSION,
            language: 'Node',
            language_version: process.version,
            uname: [os.type(), os.hostname(), os.release(), os.version(), os.machine()].join(' '),
        });
    }
}
