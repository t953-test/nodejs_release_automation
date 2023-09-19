import { RequestOptions } from './request_options.js';
import { KaradenObject } from './model/karaden_object.js';

export class Utility {
    public static objectTypes: any;

    protected static hasProperty(contents: any, propertyName: string): boolean {
        return Object.getOwnPropertyNames(contents).some((value: string) => value == propertyName);
    }

    protected static hasObjectType(contents: any): boolean {
        return (
            this.hasProperty(contents, 'object') &&
            Object.getOwnPropertyNames(this.objectTypes).some((value: string) => value == contents.object)
        );
    }

    public static convertToKaradenObject(contents: any, requestOptions: RequestOptions): KaradenObject {
        const klass = this.hasObjectType(contents) ? this.objectTypes[contents.object] : KaradenObject;
        return this.constructFrom(klass, contents, requestOptions);
    }

    public static constructFrom(klass: any, contents: any, requestOptions: RequestOptions): KaradenObject {
        const id = this.hasProperty(contents, 'id') ? contents.id : null;
        const object = new klass(id, requestOptions) as KaradenObject;

        for (const key in contents) {
            const value = contents[key];
            if (value instanceof Array) {
                object.setProperty(key, this.convertToArray(value, requestOptions));
            } else if (value instanceof Object) {
                object.setProperty(key, this.convertToKaradenObject(value, requestOptions));
            } else {
                object.setProperty(key, value);
            }
        }

        return object;
    }

    public static convertToArray(contents: any[], requestOptions: RequestOptions) {
        const array: any[] = [];
        for (const value of contents) {
            let element = value;
            if (value instanceof Array) {
                element = this.convertToArray(value, requestOptions);
            } else if (value instanceof Object) {
                element = this.convertToKaradenObject(value, requestOptions);
            }
            array.push(element);
        }
        return array;
    }

    public static toISOString(date: Date): string {
        return date.toLocaleString('sv-SE', { timeZone: 'UTC' }).replace(' ', 'T') + 'Z';
    }
}
