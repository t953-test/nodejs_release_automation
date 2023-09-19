import { RequestOptions } from '../request_options.js';

export class KaradenObject {
    protected properties: any;

    public constructor(
        id: any = null,
        protected requestOptions: RequestOptions | null = null
    ) {
        this.properties = {};
        this.setProperty('id', id);
    }

    get id(): any {
        return this.getProperty('id');
    }

    get object(): string {
        return this.getProperty('object');
    }

    public getPropertyKeys(): string[] {
        return Object.keys(this.properties);
    }

    public getProperty(key: string): any {
        return this.properties[key];
    }

    public setProperty(key: string, value: any) {
        this.properties[key] = value;
    }
}
