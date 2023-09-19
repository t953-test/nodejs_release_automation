import { Error } from '../model/error.js';
import { KaradenException } from './karaden_exception.js';

export class InvalidParamsException extends KaradenException {
    public constructor(error: Error) {
        super(null, null, error);
    }
}
