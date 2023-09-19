import { KaradenObject, Utility, Message, RequestOptions } from '../src';

test('objectのフィールドが存在しない場合はKaradenObjectが返る', () => {
    const contents = JSON.parse(`{"test": "test"}`);
    const requestOptions = new RequestOptions();
    const object = Utility.convertToKaradenObject(contents, requestOptions);
    expect(object instanceof KaradenObject).toBeTruthy();
});

test('objectのフィールドが存在してObjectTypesのマッピングが存在する場合はオブジェクトが返る', () => {
    const contents = JSON.parse(`{"object": "message"}`);
    const requestOptions = new RequestOptions();
    const object = Utility.convertToKaradenObject(contents, requestOptions);
    expect(object instanceof Message).toBeTruthy();
});

test('objectのフィールドが存在してObjectTypesのマッピングが存在しない場合はKaradenObjectが返る', () => {
    const contents = JSON.parse(`{"object": "test"}`);
    const requestOptions = new RequestOptions();
    const object = Utility.convertToKaradenObject(contents, requestOptions);
    expect(object instanceof KaradenObject).toBeTruthy();
});

describe.each([['string'], [''], [123], [0], [true], [false], [null]])(
    'プリミティブな値はデシリアライズしても変わらない',
    (expected: string | number | boolean | null) => {
        test(`プリミティブな値は'${expected}'`, () => {
            const key = 'test';
            const value = typeof expected == 'string' ? `"${expected}"` : expected;
            const contents = JSON.parse(`{"${key}": ${value}}`);
            const requestOptions = new RequestOptions();
            const object = Utility.convertToKaradenObject(contents, requestOptions);
            expect(object instanceof KaradenObject).toBeTruthy();
            expect(object.getProperty(key)).toBe(expected);
        });

        test(`の配列の要素\`${expected}\`はデシリアライズしても変わらない`, () => {
            const key = 'test';
            const value = typeof expected == 'string' ? `"${expected}"` : expected;
            const contents = JSON.parse(`{"${key}": [${value}]}`);
            const requestOptions = new RequestOptions();
            const object = Utility.convertToKaradenObject(contents, requestOptions);
            expect(object instanceof KaradenObject).toBeTruthy();
            expect(object.getProperty(key)).toBeInstanceOf(Array);
            expect(object.getProperty(key)[0]).toBe(expected);
        });
    }
);

describe.each([['string'], [''], [123], [0], [true], [false], [null]])(
    'プリミティブな値の配列の要素はデシリアライズしても変わらない',
    (expected: string | number | boolean | null) => {
        test(`プリミティブな値は'${expected}'`, () => {
            const key = 'test';
            const value = typeof expected == 'string' ? `"${expected}"` : expected;
            const contents = JSON.parse(`{"${key}": [${value}]}`);
            const requestOptions = new RequestOptions();
            const object = Utility.convertToKaradenObject(contents, requestOptions);
            expect(object instanceof KaradenObject).toBeTruthy();
            expect(object.getProperty(key)).toBeInstanceOf(Array);
            expect(object.getProperty(key)[0]).toBe(expected);
        });
    }
);

test('配列の配列もサポートする', () => {
    const key = 'test';
    const value = 'test';
    const contents = JSON.parse(`{"${key}": [["${value}"]]}`);
    const requestOptions = new RequestOptions();
    const object = Utility.convertToKaradenObject(contents, requestOptions);
    expect(object instanceof KaradenObject).toBeTruthy();
    expect(object.getProperty(key)).toBeInstanceOf(Array);
    expect(object.getProperty(key).length).toBe(1);
    expect(object.getProperty(key)[0]).toBeInstanceOf(Array);
    expect(object.getProperty(key).length).toBe(1);
    expect(object.getProperty(key)[0][0]).toBe(value);
});

describe.each([
    ['', KaradenObject],
    ['"object": null, ', KaradenObject],
    ['"object": "test", ', KaradenObject],
    ['"object": "message", ', Message],
])('オブジェクトの配列の要素はデシリアライズするとKaradenObjectに変換される', (snippet: string, expected: any) => {
    test(`オブジェクトの要素は'${snippet}'`, () => {
        const key = 'test';
        const value = 'test';
        const contents = JSON.parse(`{"${key}": [{${snippet}"${key}": "${value}"}]}`);
        const requestOptions = new RequestOptions();
        const object = Utility.convertToKaradenObject(contents, requestOptions);
        expect(object instanceof KaradenObject).toBeTruthy();
        expect(object.getProperty(key)).toBeInstanceOf(Array);
        expect(object.getProperty(key).length).toBe(1);
        expect(object.getProperty(key)[0]).toBeInstanceOf(expected);
        expect(object.getProperty(key)[0].getProperty(key)).toBe(value);
    });
});
