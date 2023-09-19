import { KaradenException } from './karaden_exception.js';

export class NotFoundException extends KaradenException {
    public static readonly STATUS_CODE = 404;
}
