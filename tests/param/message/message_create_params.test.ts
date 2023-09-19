import { InvalidParamsException, MessageCreateParams, MessageCreateParamsBuilder } from '../../../src';

test('正しいパスを生成できること', () => {
    const params = new MessageCreateParams(0, '', '');
    expect(params.toPath()).toBe(MessageCreateParams.CONTEXT_PATH);
});

test('serviceIdを送信データにできる', () => {
    const expected = 1;
    const params = new MessageCreateParams(expected, '', '');
    expect(params.toData().service_id).toBe(expected);
});

test('toを送信データにできる', () => {
    const expected = 'to';
    const params = new MessageCreateParams(0, expected, '');
    expect(params.toData().to).toBe(expected);
});

test('bodyを送信データにできる', () => {
    const expected = 'body';
    const params = new MessageCreateParams(0, '', expected);
    expect(params.toData().body).toBe(expected);
});

test('tagsを送信データにできる', () => {
    const expected = ['tags'];
    const params = new MessageCreateParams(0, '', '', expected);
    expect(params.toData().tags).toBe(expected);
});

describe.each([
    [true, 'true'],
    [false, 'false'],
    [undefined, undefined],
])('isShortenを送信データにできる', (isShorten: boolean | undefined, expected: string | undefined) => {
    test(`isShortenは'${isShorten}'`, () => {
        const params = new MessageCreateParams(0, '', '', undefined, isShorten);
        expect(params.toData().is_shorten).toBe(expected);
    });
});

test('scheduledAtを送信データにできる', () => {
    const expected = new Date('2023-07-31T00:00:00+09:00');
    const params = new MessageCreateParams(0, '', '', undefined, undefined, expected);
    expect(params.toData().scheduled_at).toBe('2023-07-30T15:00:00Z');
});

test('limitedAtを送信データにできる', () => {
    const expected = new Date('2023-07-31T00:00:00+09:00');
    const params = new MessageCreateParams(0, '', '', undefined, undefined, undefined, expected);
    expect(params.toData().limited_at).toBe('2023-07-30T15:00:00Z');
});

describe.each([[0], [-1]])('serviceIdは0や負の値はエラー', (serviceId: number) => {
    test(`serviceIdは${serviceId}`, () => {
        expect(() => {
            try {
                const params = new MessageCreateParams(serviceId, 'to', 'body');
                params.validate();
            } catch (e) {
                if (e instanceof InvalidParamsException) {
                    const messages = e.error!.errors.getProperty('serviceId');
                    expect(messages).toBeInstanceOf(Array);
                }
                throw e;
            }
        }).toThrow(InvalidParamsException);
    });
});

test('toは空文字はエラー', () => {
    expect(() => {
        try {
            const params = new MessageCreateParams(1, '', 'body');
            params.validate();
        } catch (e) {
            if (e instanceof InvalidParamsException) {
                const messages = e.error!.errors.getProperty('to');
                expect(messages).toBeInstanceOf(Array);
            }
            throw e;
        }
    }).toThrow(InvalidParamsException);
});

test('bodyは空文字はエラー', () => {
    expect(() => {
        try {
            const params = new MessageCreateParams(1, 'to', '');
            params.validate();
        } catch (e) {
            if (e instanceof InvalidParamsException) {
                const messages = e.error!.errors.getProperty('body');
                expect(messages).toBeInstanceOf(Array);
            }
            throw e;
        }
    }).toThrow(InvalidParamsException);
});

test('serviceIdを入力できる', () => {
    const expected = 1;
    const params = new MessageCreateParamsBuilder().withServiceId(expected).build();
    expect(params.serviceId).toBe(expected);
});

test('toを入力できる', () => {
    const expected = 'to';
    const params = new MessageCreateParamsBuilder().withTo(expected).build();
    expect(params.to).toBe(expected);
});

test('bodyを入力できる', () => {
    const expected = 'body';
    const params = new MessageCreateParamsBuilder().withBody(expected).build();
    expect(params.body).toBe(expected);
});

test('tagsを入力できる', () => {
    const expected = ['tags'];
    const params = new MessageCreateParamsBuilder().withTags(expected).build();
    expect(params.tags).toBe(expected);
});

test('isShortenを入力できる', () => {
    const expected = true;
    const params = new MessageCreateParamsBuilder().withIsShorten(expected).build();
    expect(params.isShorten).toBe(expected);
});

test('scheduledAtを入力できる', () => {
    const expected = new Date('2023-07-31T00:00:00+09:00');
    const params = new MessageCreateParamsBuilder().withScheduledAt(expected).build();
    expect(params.scheduledAt).toBe(expected);
});

test('limitedAtを入力できる', () => {
    const expected = new Date('2023-07-31T00:00:00+09:00');
    const params = new MessageCreateParamsBuilder().withLimitedAt(expected).build();
    expect(params.limitedAt).toBe(expected);
});
