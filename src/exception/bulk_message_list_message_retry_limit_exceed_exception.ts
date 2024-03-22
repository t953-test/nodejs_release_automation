import { KaradenException } from './karaden_exception.js';

export class BulkMessageListMessageRetryLimitExceedException extends KaradenException {
    public constructor() {
        super(null, null);
    }
}
