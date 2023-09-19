export * from './config.js';
export * from './request_options.js';
import { Utility } from './utility.js';
export * from './exception/index.js';
import { KaradenObject, Collection, Error, Requestable, Message } from './model/index.js';
import { Requestor, Response, AxiosRequestor, AxiosResponse } from './net/index.js';
export * from './param/message/index.js';

Utility.objectTypes = {};
Utility.objectTypes[Error.OBJECT_NAME] = Error;
Utility.objectTypes[Collection.OBJECT_NAME] = Collection;
Utility.objectTypes[Message.OBJECT_NAME] = Message;

Requestable.requestor = new AxiosRequestor();

export {
    Utility,
    KaradenObject,
    Collection,
    Error,
    Requestable,
    Message,
    type Requestor,
    type Response,
    AxiosRequestor,
    AxiosResponse,
};
