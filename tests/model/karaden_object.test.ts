import { KaradenObject } from '../../src';

describe.each([['string'], [''], [123], [0], [true], [false], [null]])(
    'プロパティに入出力できる',
    (expected: string | number | boolean | null) => {
        test(`プロパティは'${expected}'`, () => {
            const key = 'test';
            const object = new KaradenObject();
            object.setProperty(key, expected);
            expect(object.getProperty(key)).toBe(expected);
        });
    }
);

test('プロパティのキーを列挙できる', () => {
    const expected = ['test1', 'test2'];
    const object = new KaradenObject();
    expected.forEach((value) => object.setProperty(value, value));
    const keys = object.getPropertyKeys();
    expect(keys).toBeInstanceOf(Array);
    expected.forEach((value) => expect(keys).toContain(value));
});

describe.each([['string'], [''], [123], [0], [true], [false], [null]])(
    'idを出力できる',
    (expected: string | number | boolean | null) => {
        test(`idは'${expected}'`, () => {
            const object = new KaradenObject();
            object.setProperty('id', expected);
            expect(object.id).toBe(expected);
        });
    }
);

test('objectを出力できる', () => {
    const expected = 'test';
    const object = new KaradenObject();
    object.setProperty('object', expected);
    expect(object.object).toContain(expected);
});
