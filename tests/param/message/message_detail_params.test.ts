import {
    InvalidParamsException,
    MessageDetailParams,
    MessageDetailParamsBuilder,
    MessageListParams,
} from '../../../src';

test('正しいパスを生成できること', () => {
    const id = 'id';
    const params = new MessageDetailParams(id);
    expect(params.toPath()).toBe(`${MessageListParams.CONTEXT_PATH}/${id}`);
});

test('idは空文字はエラー', () => {
    expect(() => {
        try {
            const params = new MessageDetailParams('');
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
    const expected = 'id';
    const params = new MessageDetailParamsBuilder().withId(expected).build();
    expect(params.id).toBe(expected);
});
