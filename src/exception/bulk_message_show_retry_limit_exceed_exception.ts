import { KaradenException } from './karaden_exception.js';

export class BulkMessageShowRetryLimitExceedException extends KaradenException {
    public constructor() {
        super(null, null);
    }
}
