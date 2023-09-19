import { Error, KaradenObject } from '../../src';

test('codeを出力できる', () => {
    const value = 'code';
    const error = new Error();
    error.setProperty('code', value);
    expect(error.code).toBe(value);
});

test('messageを出力できる', () => {
    const value = 'message';
    const error = new Error();
    error.setProperty('message', value);
    expect(error.message).toBe(value);
});

test('errorsを出力できる', () => {
    const value = new KaradenObject();
    const error = new Error();
    error.setProperty('errors', value);
    expect(error.errors).toBeInstanceOf(KaradenObject);
});
