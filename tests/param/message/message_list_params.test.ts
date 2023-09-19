import { MessageListParams, MessageListParamsBuilder } from '../../../src';
import { Result, SentResult, Status } from '../../../src/model';

test('正しいパスを生成できること', () => {
    const params = new MessageListParams();
    expect(params.toPath()).toBe(MessageListParams.CONTEXT_PATH);
});

test('serviceIdをクエリにできる', () => {
    const expected = 1;
    const params = new MessageListParams(expected);
    expect(params.toParams().service_id).toBe(expected);
});

test('toをクエリにできる', () => {
    const expected = 'to';
    const params = new MessageListParams(undefined, expected);
    expect(params.toParams().to).toBe(expected);
});

test('statusをクエリにできる', () => {
    const expected = Status.Done;
    const params = new MessageListParams(undefined, undefined, expected);
    expect(params.toParams().status).toBe(expected);
});

test('resultをクエリにできる', () => {
    const expected = Result.Done;
    const params = new MessageListParams(undefined, undefined, undefined, expected);
    expect(params.toParams().result).toBe(expected);
});

test('sentResultをクエリにできる', () => {
    const expected = SentResult.None;
    const params = new MessageListParams(undefined, undefined, undefined, undefined, expected);
    expect(params.toParams().sent_result).toBe(expected);
});

test('tagをクエリにできる', () => {
    const expected = 'tag';
    const params = new MessageListParams(undefined, undefined, undefined, undefined, undefined, expected);
    expect(params.toParams().tag).toBe(expected);
});

test('startAtをクエリにできる', () => {
    const expected = new Date('2023-07-31T00:00:00+09:00');
    const params = new MessageListParams(undefined, undefined, undefined, undefined, undefined, undefined, expected);
    expect(params.toParams().start_at).toBe('2023-07-30T15:00:00Z');
});

test('endAtをクエリにできる', () => {
    const expected = new Date('2023-07-31T00:00:00+09:00');
    const params = new MessageListParams(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        expected
    );
    expect(params.toParams().end_at).toBe('2023-07-30T15:00:00Z');
});

test('pageをクエリにできる', () => {
    const expected = 1;
    const params = new MessageListParams(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        expected
    );
    expect(params.toParams().page).toBe(expected);
});

test('perPageをクエリにできる', () => {
    const expected = 1;
    const params = new MessageListParams(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        expected
    );
    expect(params.toParams().per_page).toBe(expected);
});

test('serviceIdを入力できる', () => {
    const expected = 1;
    const params = new MessageListParamsBuilder().withServiceId(expected).build();
    expect(params.serviceId).toBe(expected);
});

test('toを入力できる', () => {
    const expected = 'to';
    const params = new MessageListParamsBuilder().withTo(expected).build();
    expect(params.to).toBe(expected);
});

test('statusを入力できる', () => {
    const expected = Status.Done;
    const params = new MessageListParamsBuilder().withStatus(expected).build();
    expect(params.status).toBe(expected);
});

test('resultを入力できる', () => {
    const expected = Result.Done;
    const params = new MessageListParamsBuilder().withResult(expected).build();
    expect(params.result).toBe(expected);
});

test('sentResultを入力できる', () => {
    const expected = SentResult.None;
    const params = new MessageListParamsBuilder().withSentResult(expected).build();
    expect(params.sentResult).toBe(expected);
});

test('tagを入力できる', () => {
    const expected = 'tag';
    const params = new MessageListParamsBuilder().withTag(expected).build();
    expect(params.tag).toBe(expected);
});

test('startAtを入力できる', () => {
    const expected = new Date('2023-07-31T00:00:00+09:00');
    const params = new MessageListParamsBuilder().withStartAt(expected).build();
    expect(params.startAt).toBe(expected);
});

test('endAtを入力できる', () => {
    const expected = new Date('2023-07-31T00:00:00+09:00');
    const params = new MessageListParamsBuilder().withEndAt(expected).build();
    expect(params.endAt).toBe(expected);
});

test('pageを入力できる', () => {
    const expected = 1;
    const params = new MessageListParamsBuilder().withPage(expected).build();
    expect(params.page).toBe(expected);
});

test('perPageを入力できる', () => {
    const expected = 1;
    const params = new MessageListParamsBuilder().withPerPage(expected).build();
    expect(params.perPage).toBe(expected);
});
