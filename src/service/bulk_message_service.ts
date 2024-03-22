import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { BulkFile } from '../model/bulk_file.js';
import { BulkMessage, BulkMessageStatus } from '../model/bulk_message.js';
import { BulkMessageCreateParams } from '../param/message/bulk/bulk_message_create_params.js';
import { BulkMessageDownloadParams } from '../param/message/bulk/bulk_message_download_params.js';
import { BulkMessageListMessageParams } from '../param/message/bulk/bulk_message_list_message_params.js';
import { BulkMessageShowParams } from '../param/message/bulk/bulk_message_show_params.js';
import { BulkMessageParams } from '../param/message/bulk/bulk_message_params.js';
import { FileNotFoundException } from '../exception/file_not_found_exception.js';
import { BulkMessageCreateFailedException } from '../exception/bulk_message_create_failed_exception.js';
import { BulkMessageListMessageRetryLimitExceedException } from '../exception/bulk_message_list_message_retry_limit_exceed_exception.js';
import { BulkMessageShowRetryLimitExceedException } from '../exception/bulk_message_show_retry_limit_exceed_exception.js';
import { FileDownloadFailedException } from '../exception/file_download_failed_exception.js';
import { RequestOptions } from '../request_options.js';
import { Utility } from '../utility.js';

export class BulkMessageService {
    protected static REGEX_PATTERN = /filename="([^"]+)"/;

    public static async create(filename: string, requestOptions: RequestOptions | null = null): Promise<BulkMessage> {
        if (!fs.existsSync(filename)) {
            return Promise.reject(new FileNotFoundException());
        }

        return BulkFile.create(requestOptions)
            .then((bulkFile: BulkFile) =>
                Utility.putSignedUrl(bulkFile.url, filename, 'text/csv', requestOptions).then(() => bulkFile)
            )
            .then((bulkFile: BulkFile) => {
                const params = BulkMessageCreateParams.newBuilder().withBulkFileId(bulkFile.id).build();
                return BulkMessage.create(params, requestOptions);
            });
    }

    public static async download(
        params: BulkMessageDownloadParams,
        requestOptions: RequestOptions | null = null
    ): Promise<boolean> {
        return this.validate(params)
            .then(() => {
                const showParams = BulkMessageShowParams.newBuilder().withId(params.id).build();
                return BulkMessageService.checkBulkMessageStatus(
                    params.maxRetries,
                    params.retryInterval,
                    showParams,
                    requestOptions
                );
            })
            .then(() => {
                const resultParams = BulkMessageListMessageParams.newBuilder().withId(params.id).build();
                return this.getDownloadUrl(params.maxRetries, params.retryInterval, resultParams, requestOptions);
            })
            .then((downloadUrl) => this.getContents(downloadUrl, params.directoryPath, requestOptions));
    }

    protected static async validate(params: BulkMessageParams): Promise<BulkMessageService> {
        return new Promise<BulkMessageService>((resolve, reject) => {
            try {
                params.validate();
                resolve(new BulkMessageService());
            } catch (e) {
                reject(e);
            }
        });
    }

    protected static async getContents(
        downloadUrl: string,
        directoryPath: string,
        requestOptions: RequestOptions | null = null
    ): Promise<boolean> {
        try {
            const response = await axios.get(downloadUrl, {
                responseType: 'stream',
                timeout: Utility.getTimeout(requestOptions),
            });
            const match = response.headers['content-disposition'].match(this.REGEX_PATTERN);
            if (!match) {
                return Promise.reject(new FileDownloadFailedException());
            }
            const filename = path.join(path.resolve(directoryPath), match[1]);
            await pipeline(response.data, fs.createWriteStream(filename));
            return true;
        } catch (e) {
            return Promise.reject(new FileDownloadFailedException());
        }
    }

    protected static async checkBulkMessageStatus(
        retryCount: number,
        retryInterval: number,
        params: BulkMessageShowParams,
        requestOptions: RequestOptions | null = null
    ): Promise<void> {
        for (let count = 0; count <= retryCount; count++) {
            if (count > 0) {
                await Utility.sleep(retryInterval);
            }
            const bulkMessage = await BulkMessage.show(params, requestOptions);
            if (bulkMessage.status == BulkMessageStatus.Error) {
                return Promise.reject(new BulkMessageCreateFailedException());
            }
            if (bulkMessage.status == BulkMessageStatus.Done) {
                return;
            }
        }
        return Promise.reject(new BulkMessageShowRetryLimitExceedException());
    }

    protected static async getDownloadUrl(
        retryCount: number,
        retryInterval: number,
        params: BulkMessageListMessageParams,
        requestOptions: RequestOptions | null = null
    ): Promise<string> {
        for (let count = 0; count <= retryCount; count++) {
            if (count > 0) {
                await Utility.sleep(retryInterval);
            }
            const result = await BulkMessage.listMessage(params, requestOptions);
            if (result) {
                return result;
            }
        }
        return Promise.reject(new BulkMessageListMessageRetryLimitExceedException());
    }
}
