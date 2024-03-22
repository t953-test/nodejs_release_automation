import { KaradenException } from './karaden_exception.js';

export class FileNotFoundException extends KaradenException {
    public constructor() {
        super(null, null);
    }
}
