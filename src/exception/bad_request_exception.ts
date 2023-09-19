import { KaradenException } from './karaden_exception.js';

export class BadRequestException extends KaradenException {
    public static readonly STATUS_CODE = 400;
}
