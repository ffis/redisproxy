export class MockedDatabase {
    keys(p: string): Promise<string[]> {
        return Promise.resolve(["/api/example"]);
    }

    get(key: string): Promise<string> {
        if (key === "/api/example") {
            return Promise.resolve("[]");
        }

        return Promise.resolve("");
    }

    ready(): Promise<void> {
        return Promise.resolve();
    }
}