import { KaradenException } from './karaden_exception.js';

export class BulkMessageCreateFailedException extends KaradenException {
    public constructor() {
        super(null, null);
    }
}
