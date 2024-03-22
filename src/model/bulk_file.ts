import { RequestOptions } from '../request_options.js';
import { KaradenObject } from './karaden_object.js';
import { Requestable } from './requestable.js';
import { BulkMessageParams } from '../param/message/bulk/bulk_message_params.js';

export class BulkFile extends Requestable {
    public static readonly OBJECT_NAME = 'bulk_file';

    public get url(): string {
        return this.getProperty('url');
    }

    public get createdAt(): Date {
        const createdAt = this.getProperty('created_at');
        return new Date(createdAt);
    }

    public get expiresAt(): Date {
        const expiresAt = this.getProperty('expires_at');
        return new Date(expiresAt);
    }

    public static async create(requestOptions: RequestOptions | null = null): Promise<BulkFile> {
        const path = `${BulkMessageParams.CONTEXT_PATH}/files`;
        return this.request('POST', path, null, null, null, requestOptions).then(
            (value: KaradenObject) => value as BulkFile
        );
    }
}
