import { TestHelper } from './helper';
import { Config, InvalidRequestOptionsException, RequestOptions } from '../src';

test('getBaseUriはapiBaseとtenantIdを半角スラッシュで結合した値', () => {
    const apiBase = TestHelper.API_BASE;
    const tenantId = TestHelper.TENANT_ID;
    const requestOptions = RequestOptions.newBuilder().withApiBase(apiBase).withTenantId(tenantId).build();

    const actual = requestOptions.getBaseUri();
    const expected = `${apiBase}/${tenantId}`;
    expect(actual).toBe(expected);
});

test('マージ元がnullならばマージ先を上書きしない', () => {
    const apiKey = TestHelper.API_KEY;
    const requestOptions = [
        RequestOptions.newBuilder().withApiKey(apiKey).build(),
        RequestOptions.newBuilder().build(),
    ];

    const actual = requestOptions[0].merge(requestOptions[1]).apiKey;
    const expected = apiKey;
    expect(actual).toBe(expected);
});

test('マージ元がnullならばマージ先を上書きしない', () => {
    const apiKey = TestHelper.API_KEY;
    const requestOptions = [
        RequestOptions.newBuilder().withApiKey(apiKey).build(),
        RequestOptions.newBuilder().build(),
    ];

    const actual = requestOptions[0].merge(requestOptions[1]).apiKey;
    const expected = apiKey;
    expect(actual).toBe(expected);
});

test('apiBaseが空文字はエラー', () => {
    try {
        RequestOptions.newBuilder().withApiBase('').build().validate();
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidRequestOptionsException);
        const errors = (e as InvalidRequestOptionsException).error?.errors.getProperty('apiBase');
        expect(errors).toEqual(['apiBaseは必須です。', '文字列を入力してください。']);
    }
});

test('apiKeyが空文字はエラー', () => {
    try {
        RequestOptions.newBuilder().withApiKey('').build().validate();
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidRequestOptionsException);
        const errors = (e as InvalidRequestOptionsException).error?.errors.getProperty('apiKey');
        expect(errors).toEqual(['apiKeyは必須です。', '文字列を入力してください。']);
    }
});

test('apiVersionが空文字はエラー', () => {
    try {
        RequestOptions.newBuilder().withApiVersion('').build().validate();
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidRequestOptionsException);
        const errors = (e as InvalidRequestOptionsException).error?.errors.getProperty('apiVersion');
        expect(errors).toEqual(['apiVersionは必須です。', '文字列を入力してください。']);
    }
});

test('tenantIdが空文字はエラー', () => {
    try {
        RequestOptions.newBuilder().withTenantId('').build().validate();
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidRequestOptionsException);
        const errors = (e as InvalidRequestOptionsException).error?.errors.getProperty('tenantId');
        expect(errors).toEqual(['tenantIdは必須です。', '文字列を入力してください。']);
    }
});

test('apiBaseが未定義はエラー', () => {
    try {
        RequestOptions.newBuilder().build().validate();
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidRequestOptionsException);
        const errors = (e as InvalidRequestOptionsException).error?.errors.getProperty('apiBase');
        expect(errors).toEqual(['apiBaseは必須です。', '文字列を入力してください。']);
    }
});

test('apiKeyが未定義はエラー', () => {
    try {
        RequestOptions.newBuilder().build().validate();
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidRequestOptionsException);
        const errors = (e as InvalidRequestOptionsException).error?.errors.getProperty('apiKey');
        expect(errors).toEqual(['apiKeyは必須です。', '文字列を入力してください。']);
    }
});

test('apiVersionが未定義はエラー', () => {
    try {
        RequestOptions.newBuilder().build().validate();
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidRequestOptionsException);
        const errors = (e as InvalidRequestOptionsException).error?.errors.getProperty('apiVersion');
        expect(errors).toEqual(['apiVersionは必須です。', '文字列を入力してください。']);
    }
});

test('tenantIdが未定義はエラー', () => {
    try {
        RequestOptions.newBuilder().build().validate();
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidRequestOptionsException);
        const errors = (e as InvalidRequestOptionsException).error?.errors.getProperty('tenantId');
        expect(errors).toEqual(['tenantIdは必須です。', '文字列を入力してください。']);
    }
});

test('apiBaseを入力できること', () => {
    const expected = Config.DEFAULT_API_BASE;
    const requestOptions = RequestOptions.newBuilder().withApiBase(expected).build();
    expect(requestOptions.apiBase).toEqual(expected);
});

test('apiKeyを入力できること', () => {
    const expected = 'test';
    const requestOptions = RequestOptions.newBuilder().withApiKey(expected).build();
    expect(requestOptions.apiKey).toEqual(expected);
});

test('apiVersionを入力できること', () => {
    const expected = Config.DEFAULT_API_VERSION;
    const requestOptions = RequestOptions.newBuilder().withApiVersion(expected).build();
    expect(requestOptions.apiVersion).toEqual(expected);
});

test('tenantIdを入力できること', () => {
    const expected = 'test';
    const requestOptions = RequestOptions.newBuilder().withTenantId(expected).build();
    expect(requestOptions.tenantId).toEqual(expected);
});

test('userAgentを入力できること', () => {
    const expected = 'test';
    const requestOptions = RequestOptions.newBuilder().withUserAgent(expected).build();
    expect(requestOptions.userAgent).toEqual(expected);
});

test('readTimeoutを入力できること', () => {
    const expected = 10;
    const requestOptions = RequestOptions.newBuilder().withReadTimeout(expected).build();
    expect(requestOptions.readTimeout).toEqual(expected);
});

test('connectionTimeoutを入力できること', () => {
    const expected = 10;
    const requestOptions = RequestOptions.newBuilder().withConnectionTimeout(expected).build();
    expect(requestOptions.connectionTimeout).toEqual(expected);
});
