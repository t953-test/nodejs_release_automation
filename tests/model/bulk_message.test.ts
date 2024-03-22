import { Application } from 'express';
import { Server } from 'http';
import {
    BulkMessage,
    BulkMessageCreateParams,
    BulkMessageListMessageParams,
    BulkMessageShowParams,
    Error,
} from '../../src';
import { TestHelper } from '../helper';

let app: Application;
beforeAll(() => (app = TestHelper.getMockServer()));

let server: Server;
afterEach(() => server.close());

test('一括送信メッセージを作成できる', async () => {
    const params = BulkMessageCreateParams.newBuilder().withBulkFileId('c439f89c-1ea3-7073-7021-1f127a850437').build();
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();

    app.post(`/${requestOptions.tenantId}${params.toPath()}`, (req, res) => {
        res.status(200).json({
            result: {
                body: req.body,
                'content-type': req.header('content-type'),
            },
        });
    });
    server = app.listen(4010);

    const bulkMessage = await BulkMessage.create(params, requestOptions);
    const result = bulkMessage.getProperty('result');
    expect(result.getProperty('content-type')).toBe('application/x-www-form-urlencoded');
    expect(result.getProperty('body')).toBe('bulk_file_id=c439f89c-1ea3-7073-7021-1f127a850437');
});

test('一括送信メッセージの詳細を取得できる', async () => {
    const params = BulkMessageShowParams.newBuilder().withId('c439f89c-1ea3-7073-7021-1f127a850437').build();
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();

    app.get(`/${requestOptions.tenantId}${params.toPath()}`, (req, res) => {
        res.status(200).json({
            result: 'OK',
        });
    });
    server = app.listen(4010);

    const bulkMessage = await BulkMessage.show(params, requestOptions);
    expect(bulkMessage.getProperty('result')).toBe('OK');
});

test('一括送信メッセージの結果を取得できる', async () => {
    const params = BulkMessageListMessageParams.newBuilder().withId('c439f89c-1ea3-7073-7021-1f127a850437').build();
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const expect_url = 'http://example.com';

    app.get(`/${requestOptions.tenantId}${params.toPath()}`, (req, res) => {
        res.writeHead(302, {
            Location: expect_url,
        });
        res.end();
    });
    server = app.listen(4010);

    const output = await BulkMessage.listMessage(params, requestOptions);
    expect(output).toBe(expect_url);
});

describe.each([['location'], ['LOCATION']])(
    'Locationが大文字小文字関係なく一括送信メッセージの結果を取得できる',
    (data: string) => {
        test(`locationは${data}`, async () => {
            const params = BulkMessageListMessageParams.newBuilder()
                .withId('c439f89c-1ea3-7073-7021-1f127a850437')
                .build();
            const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
            const expect_url = 'http://example.com';

            app.get(`/${requestOptions.tenantId}${params.toPath()}`, (req, res) => {
                res.writeHead(302, {
                    data: expect_url,
                });
                res.end();
            });
            server = app.listen(4010);

            const output = await BulkMessage.listMessage(params, requestOptions);
            expect(output).toBe(expect_url);
        });
    }
);

test('statusを出力できる', () => {
    const value = 'processing';
    const bulkMessage = new BulkMessage();
    bulkMessage.setProperty('status', value);
    expect(bulkMessage.status).toBe(value);
});

test('受付エラーがない場合はerrorは出力されない', () => {
    const error = undefined;
    const bulkMessage = new BulkMessage();
    bulkMessage.setProperty('error', error);
    expect(bulkMessage.status).toBe(error);
});

test('受付エラーがあった場合はerrorが出力される', () => {
    const error = new Error();
    const bulkMessage = new BulkMessage();
    bulkMessage.setProperty('error', error);
    expect(bulkMessage.error).toBeInstanceOf(Error);
});

test('createdAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const bulkMessage = new BulkMessage();
    bulkMessage.setProperty('created_at', value);
    expect(bulkMessage.createdAt).toEqual(new Date(value));
});

test('updatedAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const bulkMessage = new BulkMessage();
    bulkMessage.setProperty('updated_at', value);
    expect(bulkMessage.updatedAt).toEqual(new Date(value));
});
