import { Application } from 'express';
import { Server } from 'http';
import { BulkFile } from '../../src';
import { TestHelper } from '../helper';

let app: Application;
beforeAll(() => (app = TestHelper.getMockServer()));

let server: Server;
afterEach(() => server.close());

test('一括送信用CSVのアップロード先URLを発行できる', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();

    app.post(`/${requestOptions.tenantId}/messages/bulks/files`, (req, res) => {
        res.status(200).json({
            result: 'OK',
        });
    });
    server = app.listen(4010);

    const bulkFile = await BulkFile.create(requestOptions);
    expect(bulkFile.getProperty('result')).toBe('OK');
});

test('urlを出力できる', () => {
    const value = 'https://example.com/';
    const bulkFile = new BulkFile();
    bulkFile.setProperty('url', value);
    expect(bulkFile.url).toBe(value);
});

test('createdAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const bulkFile = new BulkFile();
    bulkFile.setProperty('created_at', value);
    expect(bulkFile.createdAt).toEqual(new Date(value));
});

test('expiresAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const bulkFile = new BulkFile();
    bulkFile.setProperty('expires_at', value);
    expect(bulkFile.expiresAt).toEqual(new Date(value));
});
