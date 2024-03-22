import axios from 'axios';
import * as fs from 'fs';
import * as tmp from 'tmp';
import * as path from 'path';
import { Application } from 'express';
import { Server } from 'http';
import {
    BulkMessageCreateParams,
    BulkMessageDownloadParams,
    BulkMessageListMessageParams,
    BulkMessageShowParams,
    BulkMessageService,
    BulkMessageCreateFailedException,
    BulkMessageListMessageRetryLimitExceedException,
    BulkMessageShowRetryLimitExceedException,
    FileDownloadFailedException,
    FileNotFoundException,
} from '../../src';
import { TestHelper } from '../helper';

let app: Application;
let server: Server;

beforeAll(() => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    app = TestHelper.getMockServer();
    app.post(`/${requestOptions.tenantId}/messages/bulks/files`, (req, res) => {
        res.status(200).json({
            id: '741121d7-3f7e-ed85-9fac-28d87835528e',
            object: 'bulk_file',
            url: 'https://example.com',
            created_at: '2023-12-01T15:00:00.0Z',
            expires_at: '2023-12-01T15:00:00.0Z',
        });
    });

    const params = BulkMessageCreateParams.newBuilder().build();
    app.post(`/${requestOptions.tenantId}${params.toPath()}`, (req, res) => {
        res.status(200).json({
            id: 'ef931182-80ff-611c-c878-871a08bb5a6a',
            object: 'bulk_message',
            status: 'processing',
            created_at: '2023-12-01T15:00:00.0Z',
            updated_at: '2023-12-01T15:00:00.0Z',
        });
    });

    const showParams = BulkMessageShowParams.newBuilder().withId('ef931182-80ff-611c-c878-871a08bb5a6a').build();
    app.get(`/${requestOptions.tenantId}${showParams.toPath()}`, (req, res) => {
        res.status(200).json({
            id: 'ef931182-80ff-611c-c878-871a08bb5a6a',
            object: 'bulk_message',
            status: 'done',
            created_at: '2023-12-01T15:00:00.0Z',
            updated_at: '2023-12-01T15:00:00.0Z',
        });
    });

    const listMessageParams = BulkMessageListMessageParams.newBuilder()
        .withId('ef931182-80ff-611c-c878-871a08bb5a6a')
        .build();
    app.get(`/${requestOptions.tenantId}${listMessageParams.toPath()}`, (req, res) => {
        res.writeHead(302, {
            Location: 'http://localhost:4010/example.com',
        });
        res.end();
    });
});

afterEach(() => server.close());

test('bulkMessageオブジェクトが返る', async () => {
    server = app.listen(4010);

    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const tmpFile = tmp.fileSync();
    const filename = tmpFile.name;

    jest.spyOn(axios, 'put').mockResolvedValue({ data: 'signedUrl' });

    const bulkMessage = await BulkMessageService.create(filename, requestOptions);
    expect(bulkMessage.object).toBe('bulk_message');
});

test('ファイルが存在しない場合はエラー', () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const filename = 'test.csv';

    expect(BulkMessageService.create(filename, requestOptions)).rejects.toThrow(FileNotFoundException);
});

test('ファイルがダウンロードできる', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const filename = 'file.json';
    const fileContents = 'file contents';
    app.get('/example.com', (req, res) => {
        res.writeHead(200, {
            'content-disposition': 'attachment;filename="' + filename + "\";filename*=UTF-8''" + filename,
        });
        res.end(fileContents);
    });

    server = app.listen(4010);

    const tmpdir = fs.mkdtempSync('/tmp/test_');
    const downlosdParams = BulkMessageDownloadParams.newBuilder()
        .withId('ef931182-80ff-611c-c878-871a08bb5a6a')
        .withDirectoryPath(tmpdir)
        .build();

    await BulkMessageService.download(downlosdParams, requestOptions);
    expect(fs.existsSync(path.join(path.resolve(tmpdir, filename)))).toBe(true);
    const result = fs.readFileSync(path.join(path.resolve(tmpdir, filename)), 'utf-8');
    expect(result).toBe(fileContents);
});

test('bulkMessageのstatusがdone以外でリトライ回数を超過した場合はエラー', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const showParams = BulkMessageShowParams.newBuilder().withId('error-1').build();
    app.get(`/${requestOptions.tenantId}${showParams.toPath()}`, (req, res) => {
        res.status(200).json({
            id: 'ef931182-80ff-611c-c878-871a08bb5a6a',
            object: 'bulk_message',
            status: 'processing',
            created_at: '2023-12-01T15:00:00.0Z',
            updated_at: '2023-12-01T15:00:00.0Z',
        });
    });

    server = app.listen(4010);

    const tmpdir = fs.mkdtempSync('/tmp/test_');
    const downlosdParams = BulkMessageDownloadParams.newBuilder()
        .withId('error-1')
        .withDirectoryPath(tmpdir)
        .withMaxRetries(1)
        .withRetryInterval(10)
        .build();
    await expect(BulkMessageService.download(downlosdParams, requestOptions)).rejects.toThrow(
        BulkMessageShowRetryLimitExceedException
    );
}, 20000);

test('結果取得APIが202を返しリトライ回数を超過した場合はエラー', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const showParams = BulkMessageShowParams.newBuilder().withId('error-2').build();
    app.get(`/${requestOptions.tenantId}${showParams.toPath()}`, (req, res) => {
        res.status(200).json({
            id: 'ef931182-80ff-611c-c878-871a08bb5a6a',
            object: 'bulk_message',
            status: 'done',
            created_at: '2023-12-01T15:00:00.0Z',
            updated_at: '2023-12-01T15:00:00.0Z',
        });
    });

    const listMessageParams = BulkMessageListMessageParams.newBuilder().withId('error-2').build();
    app.get(`/${requestOptions.tenantId}${listMessageParams.toPath()}`, (req, res) => {
        res.writeHead(202, {});
        res.end();
    });

    server = app.listen(4010);

    const tmpdir = fs.mkdtempSync('/tmp/test_');
    const downlosdParams = BulkMessageDownloadParams.newBuilder()
        .withId('error-2')
        .withDirectoryPath(tmpdir)
        .withMaxRetries(1)
        .withRetryInterval(10)
        .build();
    await expect(BulkMessageService.download(downlosdParams, requestOptions)).rejects.toThrow(
        BulkMessageListMessageRetryLimitExceedException
    );
}, 20000);

test('bulkMessageのstatusがerrorはエラー', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const showParams = BulkMessageShowParams.newBuilder().withId('error-3').build();
    app.get(`/${requestOptions.tenantId}${showParams.toPath()}`, (req, res) => {
        res.status(200).json({
            id: 'ef931182-80ff-611c-c878-871a08bb5a6a',
            object: 'bulk_message',
            status: 'error',
            created_at: '2023-12-01T15:00:00.0Z',
            updated_at: '2023-12-01T15:00:00.0Z',
        });
    });

    server = app.listen(4010);

    const tmpdir = fs.mkdtempSync('/tmp/test_');
    const downlosdParams = BulkMessageDownloadParams.newBuilder()
        .withId('error-3')
        .withDirectoryPath(tmpdir)
        .withMaxRetries(1)
        .withRetryInterval(10)
        .build();
    await expect(BulkMessageService.download(downlosdParams, requestOptions)).rejects.toThrow(
        BulkMessageCreateFailedException
    );
});

test('ファイルダウンロード処理にエラーが発生した場合は例外が飛ぶ', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const showParams = BulkMessageShowParams.newBuilder().withId('error-4').build();
    app.get(`/${requestOptions.tenantId}${showParams.toPath()}`, (req, res) => {
        res.status(200).json({
            id: 'ef931182-80ff-611c-c878-871a08bb5a6a',
            object: 'bulk_message',
            status: 'done',
            created_at: '2023-12-01T15:00:00.0Z',
            updated_at: '2023-12-01T15:00:00.0Z',
        });
    });

    const listMessageParams = BulkMessageListMessageParams.newBuilder().withId('error-4').build();
    app.get(`/${requestOptions.tenantId}${listMessageParams.toPath()}`, (req, res) => {
        res.writeHead(302, {
            Location: 'http://localhost:4010/invalid.com',
        });
        res.end();
    });

    app.get('/invalid.com', (req, res) => {
        res.writeHead(200, {
            'content-disposition': 'invalid',
        });
        res.end();
    });

    server = app.listen(4010);

    const tmpdir = fs.mkdtempSync('/tmp/test_');
    const downlosdParams = BulkMessageDownloadParams.newBuilder()
        .withId('error-4')
        .withDirectoryPath(tmpdir)
        .withMaxRetries(1)
        .withRetryInterval(10)
        .build();
    await expect(BulkMessageService.download(downlosdParams, requestOptions)).rejects.toThrow(
        FileDownloadFailedException
    );
});
