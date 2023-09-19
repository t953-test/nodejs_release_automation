import { TestHelper } from '../helper';
import { Application } from 'express';
import { Server } from 'http';
import { randomUUID } from 'crypto';
import { AxiosRequestor, Config, Response } from '../../src';

let app: Application;
beforeAll(() => (app = TestHelper.getMockServer()));

let server: Server;
afterEach(() => server.close());

test('ベースURLとパスが結合される', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const path = 'test';

    app.get(`/${requestOptions.tenantId}/${path}`, (req, res) => res.status(200).json({ result: req.originalUrl }));
    server = app.listen(4010);

    const requestor = new AxiosRequestor();

    await requestor
        .invoke('GET', path, null, null, null, requestOptions)
        .then((response: Response) =>
            expect(response.object!.getProperty('result')).toBe(`/${requestOptions.tenantId}/${path}`)
        );
});

test('メソッドがHTTPクライアントに伝わる', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const path = 'test2';
    const method = 'POST';

    app.use((req, res, next) => {
        if (req.originalUrl == `/${requestOptions.tenantId}/${path}`) {
            res.status(200).json({ result: req.method });
        } else {
            next();
        }
    });
    server = app.listen(4010);

    const requestor = new AxiosRequestor();

    await requestor
        .invoke(method, path, null, null, null, requestOptions)
        .then((response: Response) => expect(response.object!.getProperty('result')).toBe(method));
});

test('URLパラメータがHTTPクライアントに伝わる', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const path = 'test3';
    const params = { key1: 'value1', key2: 'value2' };

    app.get(`/${requestOptions.tenantId}/${path}`, (req, res) =>
        res.status(200).json({ result: JSON.stringify(req.query) })
    );
    server = app.listen(4010);

    const requestor = new AxiosRequestor();

    await requestor
        .invoke('GET', path, null, params, null, requestOptions)
        .then((response: Response) => expect(response.object!.getProperty('result')).toBe(JSON.stringify(params)));
});

test('本文がHTTPクライアントに伝わる', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const path = 'test4';
    const data = { key1: 'value1', key2: 'value2' };

    app.post(`/${requestOptions.tenantId}/${path}`, (req, res) => res.status(200).json({ result: req.body }));
    server = app.listen(4010);

    const requestor = new AxiosRequestor();

    await requestor
        .invoke('POST', path, 'application/x-www-form-urlencoded', null, data, requestOptions)
        .then((response: Response) => expect(response.object!.getProperty('result')).toBe('key1=value1&key2=value2'));
});

test('リクエスト時に指定したリクエストオプションはコンストラクタのリクエストオプションを上書きする', async () => {
    const apiKey = '456';
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.withApiKey(apiKey).build();
    const path = 'test5';

    app.get(`/${requestOptions.tenantId}/${path}`, (req, res) =>
        res.status(200).json({ result: req.header('Authorization') })
    );
    server = app.listen(4010);

    const requestor = new AxiosRequestor();

    await requestor
        .invoke('GET', path, null, null, null, requestOptions)
        .then((response: Response) => expect(response.object!.getProperty('result')).toBe(`Bearer ${apiKey}`));
});

test('APIキーに基づいてBearer認証ヘッダを出力する', async () => {
    const apiKey = '456';
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.withApiKey(apiKey).build();
    const path = 'test6';

    app.get(`/${requestOptions.tenantId}/${path}`, (req, res) =>
        res.status(200).json({ result: req.header('Authorization') })
    );
    server = app.listen(4010);

    const requestor = new AxiosRequestor();

    await requestor
        .invoke('GET', path, null, null, null, requestOptions)
        .then((response: Response) => expect(response.object!.getProperty('result')).toBe(`Bearer ${apiKey}`));
});

test('APIバージョンを設定した場合はAPIバージョンヘッダを出力する', async () => {
    const apiVersion = '2023-01-01';
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.withApiVersion(apiVersion).build();
    const path = 'test7';

    app.get(`/${requestOptions.tenantId}/${path}`, (req, res) =>
        res.status(200).json({ result: req.header('Karaden-Version') })
    );
    server = app.listen(4010);

    const requestor = new AxiosRequestor();

    await requestor
        .invoke('GET', path, null, null, null, requestOptions)
        .then((response: Response) => expect(response.object!.getProperty('result')).toBe(apiVersion));
});

test('APIバージョンを設定しない場合はデフォルトのAPIバージョンヘッダを出力する', async () => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    const path = 'test8';

    app.get(`/${requestOptions.tenantId}/${path}`, (req, res) =>
        res.status(200).json({ result: req.header('Karaden-Version') })
    );
    server = app.listen(4010);

    const requestor = new AxiosRequestor();

    await requestor
        .invoke('GET', path, null, null, null, requestOptions)
        .then((response: Response) => expect(response.object!.getProperty('result')).toBe(Config.DEFAULT_API_VERSION));
});
