import { AxiosHeaders } from 'axios';
import {
    AxiosResponse,
    BadRequestException,
    ForbiddenException,
    KaradenObject,
    NotFoundException,
    RequestOptions,
    TooManyRequestsException,
    UnauthorizedException,
    UnexpectedValueException,
    UnknownErrorException,
    UnprocessableEntityException,
} from '../../src';

test('正常系のステータスコードで本文がJSONならばオブジェクトが返る', () => {
    const statusCode = 200;
    const requestOptions = new RequestOptions();
    const response = new AxiosResponse(
        {
            data: '{"test": "test"}',
            status: statusCode,
            statusText: 'OK',
            headers: {},
            config: {
                headers: new AxiosHeaders({}),
            },
        },
        requestOptions
    );
    expect(response.isError).toBeFalsy();
    expect(response.object).toBeInstanceOf(KaradenObject);
});

test('エラー系のステータスコードで本文にobjectのプロパティがなければUnexpectedValueException', () => {
    const statusCode = 400;
    const requestOptions = new RequestOptions();
    const response = new AxiosResponse(
        {
            data: '{"test": "test"}',
            status: 400,
            statusText: 'Bad Request',
            headers: {},
            config: {
                headers: new AxiosHeaders({}),
            },
        },
        requestOptions
    );
    expect(response.isError).toBeTruthy();
    expect(response.error).toBeInstanceOf(UnexpectedValueException);
    expect((response.error! as UnexpectedValueException).statusCode).toBe(statusCode);
});

describe.each([[100], [200], [300], [400], [500]])(
    'ステータスコードによらず本文がJSONでなければUnexpectedValueException',
    (statusCode: number) => {
        test(`ステータスコードは'${statusCode}'`, () => {
            const requestOptions = new RequestOptions();
            const response = new AxiosResponse(
                {
                    data: '',
                    status: statusCode,
                    statusText: '',
                    headers: {},
                    config: {
                        headers: new AxiosHeaders({}),
                    },
                },
                requestOptions
            );
            expect(response.isError).toBeTruthy();
            expect(response.error).toBeInstanceOf(UnexpectedValueException);
            expect((response.error! as UnexpectedValueException).statusCode).toBe(statusCode);
        });
    }
);

describe.each([['message'], [''], [null]])(
    'エラー系のステータスコードで本文にobjectのプロパティの値がerror以外はUnexpectedValueException',
    (value: string | null) => {
        test(`objectのプロパティの値は'${value}'`, () => {
            const statusCode = 400;
            const requestOptions = new RequestOptions();
            const response = new AxiosResponse(
                {
                    data: `{"object": "${value}"}`,
                    status: 400,
                    statusText: 'Bad Request',
                    headers: {},
                    config: {
                        headers: new AxiosHeaders({}),
                    },
                },
                requestOptions
            );
            expect(response.isError).toBeTruthy();
            expect(response.error).toBeInstanceOf(UnexpectedValueException);
            expect((response.error! as UnexpectedValueException).statusCode).toBe(statusCode);
        });
    }
);

const range = (start: number, end: number): number[] =>
    [...new Array<number>(end - start + 1)].map((_, i) => start + i);

const specialExceptions = [
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
    UnprocessableEntityException,
    TooManyRequestsException,
];

describe.each(
    range(100, 199)
        .concat(range(400, 599))
        .filter(
            (statusCode: number) =>
                !specialExceptions.some((specialException: any) => specialException.STATUS_CODE == statusCode)
        )
        .map((statusCode: number) => [statusCode])
)('エラー系のステータスコードで特殊例外以外はUnknownErrorException', (statusCode: number) => {
    test(`ステータスコードは'${statusCode}'`, () => {
        const requestOptions = new RequestOptions();
        const response = new AxiosResponse(
            {
                data: `{"object": "error", "test": "test"}`,
                status: statusCode,
                statusText: '',
                headers: {},
                config: {
                    headers: new AxiosHeaders({}),
                },
            },
            requestOptions
        );

        expect(response.isError).toBeTruthy();
        expect(response.error).toBeInstanceOf(UnknownErrorException);
        expect((response.error! as UnknownErrorException).statusCode).toBe(statusCode);
    });
});

describe.each(specialExceptions.map((specialException: any) => [specialException]))(
    '特殊例外のステータスコード',
    (specialException: any) => {
        test(`ステータスコードは'${specialException.STATUS_CODE}'`, () => {
            const requestOptions = new RequestOptions();
            const response = new AxiosResponse(
                {
                    data: `{"object": "error", "test": "test"}`,
                    status: specialException.STATUS_CODE,
                    statusText: '',
                    headers: {},
                    config: {
                        headers: new AxiosHeaders({}),
                    },
                },
                requestOptions
            );

            expect(response.isError).toBeTruthy();
            expect(response.error).toBeInstanceOf(specialException);
        });
    }
);
