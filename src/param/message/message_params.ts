export abstract class MessageParams {
    public static CONTEXT_PATH: string = '/messages';

    public validate(): MessageParams {
        return this;
    }
}
