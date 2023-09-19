import { KaradenException } from '../exception/index.js';
import { KaradenObject } from '../model/index.js';

export interface Response {
    readonly isError: boolean;
    readonly error: KaradenException | null;
    readonly object: KaradenObject | null;
}
