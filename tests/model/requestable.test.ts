import { TestHelper } from '../helper';
import { Application } from 'express';
import { Server } from 'http';
import { Requestable, UnexpectedValueException } from '../../src';

let app: Application;
let server: Server;
beforeAll(() => {
    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    app = TestHelper.getMockServer();
    app.use((req, res, next) => {
        if (req.originalUrl == `/${requestOptions.tenantId}/test`) {
            res.status(500).json({ result: req.method });
        } else {
            next();
        }
    });
});

afterEach(() => server.close());

test('request内でrejectしたエラーをcatchできる', async () => {
    server = app.listen(4010);

    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    expect.assertions(1);
    await Requestable.request('GET', 'Test', null, null, null, requestOptions).catch((error) => {
        expect(error instanceof UnexpectedValueException).toBeTruthy();
    });
});

test('requestAndReturnResponseInterface内でrejectしたエラーをcatchできる', async () => {
    server = app.listen(4010);

    const requestOptions = TestHelper.defaultRequestOptionsBuilder.build();
    expect.assertions(1);
    await Requestable.requestAndReturnResponseInterface('GET', 'Test', null, null, null, requestOptions).catch(
        (error) => {
            console.log(error);
            expect(error instanceof UnexpectedValueException).toBeTruthy();
        }
    );
});
