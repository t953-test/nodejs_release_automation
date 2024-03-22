import { KaradenException } from './karaden_exception.js';

export class FileDownloadFailedException extends KaradenException {
    public constructor() {
        super(null, null);
    }
}
