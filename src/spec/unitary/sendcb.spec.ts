import { Response } from "express";
import { sendCb } from "../../plugins/utils";

interface ThisSpec {
    res: Response;
}

describe("send callback", () => {

    beforeEach(function(this: ThisSpec) {
        const fakeres = {
            status: (_code: number) => { return fakeres; },
            jsonp: (_body: any) => { return fakeres; },
            end: () => { }
        } as Response;

        spyOn(fakeres, "status").and.callThrough();
        spyOn(fakeres, "jsonp").and.callThrough();
        spyOn(fakeres, "end").and.callThrough();
        this.res = fakeres;
    })

    it("should work with no errors", function(this: ThisSpec) {
        const value = {"casa": "valor"};
        const stringified = JSON.stringify(value);
        sendCb(this.res, JSON.parse)(null, stringified);

        expect(this.res.status).toHaveBeenCalledWith(200);
        expect(this.res.jsonp).toHaveBeenCalledWith(value);
    });

    it("should work with errors", function(this: ThisSpec) {
        const value = {"casa": "valor"};
        const stringified = JSON.stringify(value);
        sendCb(this.res, JSON.parse)(new Error("my error"), stringified);

        expect(this.res.status).toHaveBeenCalledWith(500);
        expect(this.res.jsonp).toHaveBeenCalledWith("Error!");
    });

    it("should work with empty value", function(this: ThisSpec) {
        sendCb(this.res, JSON.parse)(null, "");

        expect(this.res.status).toHaveBeenCalledWith(404);
    });
});
