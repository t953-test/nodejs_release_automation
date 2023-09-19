import { Collection } from '../../src';

test('dataを出力できる', () => {
    const value: any[] = [];
    const collection = new Collection();
    collection.setProperty('data', value);
    expect(collection.data).toBe(value);
});

test('hasMoreを出力できる', () => {
    const value: boolean = true;
    const collection = new Collection();
    collection.setProperty('has_more', value);
    expect(collection.hasMore).toBe(value);
});
