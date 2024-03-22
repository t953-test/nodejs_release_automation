import { BulkMessageDownloadParams, BulkMessageDownloadParamsBuilder, InvalidParamsException } from '../../../../src';
import * as fs from 'fs';
import * as tmp from 'tmp';

test('idは空文字はエラー', () => {
    expect(() => {
        try {
            const params = new BulkMessageDownloadParams('', '');
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

describe.each([[0], [6], [-1], [1.1]])('maxRetriesが0以下または6以上または小数値はエラー', (maxRetries: number) => {
    test(`maxRetriesは${maxRetries}`, () => {
        expect(() => {
            try {
                const params = new BulkMessageDownloadParams('', '', maxRetries, 0);
                params.validate();
            } catch (e) {
                if (e instanceof InvalidParamsException) {
                    const messages = e.error!.errors.getProperty('maxRetries');
                    expect(messages).toBeInstanceOf(Array);
                }
                throw e;
            }
        }).toThrow(InvalidParamsException);
    });
});

test('directoryPathが存在しない値の場合はエラー', () => {
    expect(() => {
        try {
            const params = new BulkMessageDownloadParams('', 'invalid');
            params.validate();
        } catch (e) {
            if (e instanceof InvalidParamsException) {
                const messages = e.error!.errors.getProperty('directoryPath');
                expect(messages).toBeInstanceOf(Array);
            }
            throw e;
        }
    }).toThrow(InvalidParamsException);
});

test('directoryPathがファイルを指定している場合はエラー', () => {
    expect(() => {
        try {
            const params = new BulkMessageDownloadParams('', tmp.fileSync().name);
            params.validate();
        } catch (e) {
            if (e instanceof InvalidParamsException) {
                const messages = e.error!.errors.getProperty('directoryPath');
                expect(messages).toBeInstanceOf(Array);
            }
            throw e;
        }
    }).toThrow(InvalidParamsException);
});

test('指定されたdirectoryPathに読み取り権限がない場合はエラー', () => {
    expect(() => {
        const tmpdir = fs.mkdtempSync('/tmp/test_');
        fs.chmodSync(tmpdir, 0o377);
        try {
            const params = new BulkMessageDownloadParams('', tmpdir);
            params.validate();
        } catch (e) {
            if (e instanceof InvalidParamsException) {
                const messages = e.error!.errors.getProperty('directoryPath');
                expect(messages).toBeInstanceOf(Array);
            }
            throw e;
        } finally {
            fs.chmodSync(tmpdir, 0o777);
            fs.rmdirSync(tmpdir);
        }
    }).toThrow(InvalidParamsException);
});

test('指定されたdirectoryPathに書き込み権限がない場合はエラー', () => {
    expect(() => {
        const tmpdir = fs.mkdtempSync('/tmp/test_');
        fs.chmodSync(tmpdir, 0o577);
        try {
            const params = new BulkMessageDownloadParams('', tmpdir);
            params.validate();
        } catch (e) {
            if (e instanceof InvalidParamsException) {
                const messages = e.error!.errors.getProperty('directoryPath');
                expect(messages).toBeInstanceOf(Array);
            }
            throw e;
        } finally {
            fs.chmodSync(tmpdir, 0o777);
            fs.rmdirSync(tmpdir);
        }
    }).toThrow(InvalidParamsException);
});

describe.each([[61], [9], [-1], [10.1]])('retryIntervalが61以上9以下または小数値はエラー', (retryInterval: number) => {
    test(`retryIntervalは${retryInterval}`, () => {
        expect(() => {
            try {
                const params = new BulkMessageDownloadParams('', '', retryInterval, 0);
                params.validate();
            } catch (e) {
                if (e instanceof InvalidParamsException) {
                    const messages = e.error!.errors.getProperty('retryInterval');
                    expect(messages).toBeInstanceOf(Array);
                }
                throw e;
            }
        }).toThrow(InvalidParamsException);
    });
});

test('idを入力できる', () => {
    const expected = '72fe94ec-9c7d-9634-8226-e3136bd6cf7a';
    const params = new BulkMessageDownloadParamsBuilder().withId(expected).build();
    expect(params.id).toBe(expected);
});

test('directoryPathを入力できる', () => {
    const expected = 'path';
    const params = new BulkMessageDownloadParamsBuilder().withDirectoryPath(expected).build();
    expect(params.directoryPath).toBe(expected);
});

test('maxRetriesを入力できる', () => {
    const expected = 1;
    const params = new BulkMessageDownloadParamsBuilder().withMaxRetries(expected).build();
    expect(params.maxRetries).toBe(expected);
});

test('retryIntervalを入力できる', () => {
    const expected = 1;
    const params = new BulkMessageDownloadParamsBuilder().withRetryInterval(expected).build();
    expect(params.retryInterval).toBe(expected);
});
