import { RequestOptions } from '../request_options.js';
import { Response } from './response.interface.js';

export interface Requestor {
    invoke(
        method: string,
        path: string,
        contentType: string | null,
        params: any,
        data: any,
        requestOptions: RequestOptions | null,
        isNoContents?: boolean | null,
        allowRedirects?: boolean | null
    ): Promise<Response>;
}
