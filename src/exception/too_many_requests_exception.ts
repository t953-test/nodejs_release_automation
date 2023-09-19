import { KaradenException } from './karaden_exception.js';

export class TooManyRequestsException extends KaradenException {
    public static readonly STATUS_CODE = 429;
}
