import { KaradenException } from './karaden_exception.js';

export class UnprocessableEntityException extends KaradenException {
    public static readonly STATUS_CODE = 422;
}
