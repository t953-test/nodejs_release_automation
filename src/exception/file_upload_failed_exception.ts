import { KaradenException } from './karaden_exception.js';

export class FileUploadFailedException extends KaradenException {
    public constructor() {
        super(null, null);
    }
}
