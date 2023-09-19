import { TestHelper } from './helper';
import { Config } from '../src';

test('apiBaseのデフォルト値はConfig.DEFAULT_API_BASEであること', () => {
    expect(Config.apiBase).toBe(Config.DEFAULT_API_BASE);
});

test('apiVersionのデフォルト値はConfig.DEFAULT_API_VERSIONであること', () => {
    expect(Config.apiVersion).toBe(Config.DEFAULT_API_VERSION);
});

test('入力したapiBaseが取得したRequestOptionsに入力されること', () => {
    const expected = TestHelper.API_BASE;
    Config.apiBase = expected;
    const requestOptions = Config.asRequestOptions();
    const actual = requestOptions.apiBase;
    expect(actual).toBe(expected);
});

test('入力したapiKeyが取得したRequestOptionsに入力されること', () => {
    const expected = TestHelper.API_KEY;
    Config.apiKey = expected;
    const requestOptions = Config.asRequestOptions();
    const actual = requestOptions.apiKey;
    expect(actual).toBe(expected);
});

test('入力したtenantIdが取得したRequestOptionsに入力されること', () => {
    const expected = TestHelper.TENANT_ID;
    Config.tenantId = expected;
    const requestOptions = Config.asRequestOptions();
    expect(requestOptions.tenantId).toBe(expected);
});

test('入力したapiVersionが取得したRequestOptionsに入力されること', () => {
    const expected = TestHelper.API_VERSION;
    Config.apiVersion = expected;
    const requestOptions = Config.asRequestOptions();
    expect(requestOptions.apiVersion).toBe(expected);
});

test('入力したuserAgentが取得したRequestOptionsに入力されること', () => {
    const expected = 'userAgent';
    Config.userAgent = expected;
    const requestOptions = Config.asRequestOptions();
    expect(requestOptions.userAgent).toBe(expected);
});
