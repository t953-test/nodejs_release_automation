import { KaradenException } from './karaden_exception.js';

export class UnauthorizedException extends KaradenException {
    public static readonly STATUS_CODE = 401;
}
