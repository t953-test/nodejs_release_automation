import { KaradenException } from './karaden_exception.js';

export class NotImplementationException extends KaradenException {
    public constructor() {
        super(null, null);
    }
}
