import { BulkMessageShowParams, BulkMessageShowParamsBuilder, InvalidParamsException } from '../../../../src';

test('正しいパスを生成できること', () => {
    const id = '72fe94ec-9c7d-9634-8226-e3136bd6cf7a';
    const params = new BulkMessageShowParams(id);
    expect(params.toPath()).toBe(`${BulkMessageShowParams.CONTEXT_PATH}/${id}`);
});

test('idは空文字はエラー', () => {
    expect(() => {
        try {
            const params = new BulkMessageShowParams('');
            params.validate();
        } catch (e) {
            if (e instanceof InvalidParamsException) {
                const messages = e.error!.errors.getProperty('id');
                expect(messages).toBeInstanceOf(Array);
            }
            throw e;
        }
    }).toThrow(InvalidParamsException);
});

test('idを入力できる', () => {
    const expected = '72fe94ec-9c7d-9634-8226-e3136bd6cf7a';
    const params = new BulkMessageShowParamsBuilder().withId(expected).build();
    expect(params.id).toBe(expected);
});
