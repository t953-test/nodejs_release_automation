import { KaradenObject } from './karaden_object.js';

export class Collection extends KaradenObject {
    public static readonly OBJECT_NAME = 'list';

    get data(): any {
        return this.getProperty('data');
    }

    get hasMore(): boolean {
        return this.getProperty('has_more');
    }
}
