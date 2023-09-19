import { Application } from 'express';
import { Server } from 'http';
import { Message, MessageCancelParams, MessageCreateParams, MessageDetailParams, MessageListParams } from '../../src';
import { Carrier, Result, SentResult, Status } from '../../src/model';
import { TestHelper } from '../helper';

let app: Application;
beforeAll(() => (app = TestHelper.getMockServer()));

let server: Server;
afterEach(() => server.close());

test('メッセージを作成できる', async () => {
    const params = MessageCreateParams.newBuilder()
        .withServiceId(1)
        .withTo('to')
        .withBody('body')
        .withTags(['a', 'b'])
        .build();
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

    const message = await Message.create(params, requestOptions);
    const result = message.getProperty('result');
    expect(result.getProperty('content-type')).toBe('application/x-www-form-urlencoded');
    expect(result.getProperty('body')).toBe('service_id=1&to=to&body=body&tags%5B0%5D=a&tags%5B1%5D=b');
});

test('メッセージの詳細を取得できる', async () => {
    const params = MessageDetailParams.newBuilder().withId('id').build();
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();

    app.get(`/${requestOptions.tenantId}${params.toPath()}`, (req, res) => {
        res.status(200).json({
            result: 'OK',
        });
    });
    server = app.listen(4010);

    const message = await Message.detail(params, requestOptions);
    expect(message.getProperty('result')).toBe('OK');
});

test('メッセージの一覧を取得できる', async () => {
    const params = MessageListParams.newBuilder().build();
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();

    app.get(`/${requestOptions.tenantId}${params.toPath()}`, (req, res) => {
        res.status(200).json({
            result: 'OK',
        });
    });
    server = app.listen(4010);

    const message = await Message.list(params, requestOptions);
    expect(message.getProperty('result')).toBe('OK');
});

test('メッセージの送信をキャンセルできる', async () => {
    const params = MessageCancelParams.newBuilder().withId('id').build();
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();

    app.post(`/${requestOptions.tenantId}${params.toPath()}`, (req, res) => {
        res.status(200).json({
            result: 'OK',
        });
    });
    server = app.listen(4010);

    const message = await Message.cancel(params, requestOptions);
    expect(message.getProperty('result')).toBe('OK');
});

test('serviceIdを出力できる', () => {
    const value = 1;
    const message = new Message();
    message.setProperty('service_id', value);
    expect(message.serviceId).toBe(value);
});

test('billingAddressIdを出力できる', () => {
    const value = 1;
    const message = new Message();
    message.setProperty('billing_address_id', value);
    expect(message.billingAddressId).toBe(value);
});

test('toを出力できる', () => {
    const value = '1234567890';
    const message = new Message();
    message.setProperty('to', value);
    expect(message.to).toBe(value);
});

test('tagsを出力できる', () => {
    const value = ['tag'];
    const message = new Message();
    message.setProperty('tags', value);
    expect(message.tags).toBe(value);
});

test('statusを出力できる', () => {
    const value = Status.Done;
    const message = new Message();
    message.setProperty('status', value);
    expect(message.status).toBe(value);
});

test('resultを出力できる', () => {
    const value = Result.Done;
    const message = new Message();
    message.setProperty('result', value);
    expect(message.result).toBe(value);
});

test('sentResultを出力できる', () => {
    const value = SentResult.None;
    const message = new Message();
    message.setProperty('sent_result', value);
    expect(message.sentResult).toBe(value);
});

test('carrierを出力できる', () => {
    const value = Carrier.Docomo;
    const message = new Message();
    message.setProperty('carrier', value);
    expect(message.carrier).toBe(value);
});

test('scheduledAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const message = new Message();
    message.setProperty('scheduled_at', value);
    expect(message.scheduledAt).toEqual(new Date(value));
});

test('limitedAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const message = new Message();
    message.setProperty('limited_at', value);
    expect(message.limitedAt).toEqual(new Date(value));
});

test('sentAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const message = new Message();
    message.setProperty('sent_at', value);
    expect(message.sentAt).toEqual(new Date(value));
});

test('receivedAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const message = new Message();
    message.setProperty('received_at', value);
    expect(message.receivedAt).toEqual(new Date(value));
});

test('chargedAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const message = new Message();
    message.setProperty('charged_at', value);
    expect(message.chargedAt).toEqual(new Date(value));
});

test('createdAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const message = new Message();
    message.setProperty('created_at', value);
    expect(message.createdAt).toEqual(new Date(value));
});

test('updatedAtを出力できる', () => {
    const value = '2023-07-31T00:00:00+09:00';
    const message = new Message();
    message.setProperty('updated_at', value);
    expect(message.updatedAt).toEqual(new Date(value));
});
