import { Requestor } from '../net/requestor.interface.js';
import { Response } from '../net/response.interface.js';
import { RequestOptions } from '../request_options.js';
import { KaradenObject } from './karaden_object.js';

export class Requestable extends KaradenObject {
    public static requestor: Requestor;

    public static async request(
        method: string,
        path: string,
        contentType: string | null = null,
        params: any = null,
        data: any = null,
        requestOptions: RequestOptions | null = null
    ): Promise<KaradenObject> {
        return this.requestor
            .invoke(method, path, contentType, params, data, requestOptions)
            .then((response: Response) => (response.isError ? Promise.reject(response.error!) : response.object!));
    }
}
