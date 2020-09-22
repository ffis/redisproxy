
export interface Database {
    keys: (p: string) => Promise<string[]>;
    get: (key: string) => Promise<string>;
    ready: () => Promise<void>;
}