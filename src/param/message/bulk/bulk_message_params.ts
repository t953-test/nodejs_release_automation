export abstract class BulkMessageParams {
    public static CONTEXT_PATH: string = '/messages/bulks';

    public validate(): BulkMessageParams {
        return this;
    }
}
