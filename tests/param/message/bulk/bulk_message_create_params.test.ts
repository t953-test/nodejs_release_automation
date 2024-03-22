import { BulkMessageCreateParams, BulkMessageCreateParamsBuilder, InvalidParamsException } from '../../../../src';

test('正しいパスを生成できること', () => {
    const bulkFileId = '72fe94ec-9c7d-9634-8226-e3136bd6cf7a';
    const params = new BulkMessageCreateParams(bulkFileId);
    expect(params.toPath()).toBe(BulkMessageCreateParams.CONTEXT_PATH);
});

test('bulkFileIdを送信データにできる', () => {
    const expected = '72fe94ec-9c7d-9634-8226-e3136bd6cf7a';
    const params = new BulkMessageCreateParams(expected);
    expect(params.toData().bulk_file_id).toBe(expected);
});

test('bulkFileIdは空文字はエラー', () => {
    expect(() => {
        try {
            const params = new BulkMessageCreateParams('');
            params.validate();
        } catch (e) {
            if (e instanceof InvalidParamsException) {
                const messages = e.error!.errors.getProperty('bulkFileId');
                expect(messages).toBeInstanceOf(Array);
            }
            throw e;
        }
    }).toThrow(InvalidParamsException);
});

test('bulkFileIdを入力できる', () => {
    const expected = '72fe94ec-9c7d-9634-8226-e3136bd6cf7a';
    const params = new BulkMessageCreateParamsBuilder().withBulkFileId(expected).build();
    expect(params.bulkFileId).toBe(expected);
});
