import { KaradenException } from './karaden_exception.js';

export class ForbiddenException extends KaradenException {
    public static readonly STATUS_CODE = 403;
}
