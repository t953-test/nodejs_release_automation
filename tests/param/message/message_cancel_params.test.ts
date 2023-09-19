import {
    InvalidParamsException,
    MessageCancelParams,
    MessageCancelParamsBuilder,
    MessageListParams,
} from '../../../src';

test('正しいパスを生成できること', () => {
    const id = 'id';
    const params = new MessageCancelParams(id);
    expect(params.toPath()).toBe(`${MessageListParams.CONTEXT_PATH}/${id}/cancel`);
});

test('idは空文字はエラー', () => {
    expect(() => {
        try {
            const params = new MessageCancelParams('');
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
    const params = new MessageCancelParamsBuilder().withId(expected).build();
    expect(params.id).toBe(expected);
});
