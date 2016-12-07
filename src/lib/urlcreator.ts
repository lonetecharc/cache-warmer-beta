export class UrlCreator{
    baseUrl: string;
    apiSignature: string;
    private callerUrl: string;
    constructor(baseUrl: string, apiSignature: string){
        this.baseUrl = baseUrl;
        this.apiSignature = apiSignature;
    }

    getCallerUrl(): string{
        this.callerUrl = this.baseUrl + this.apiSignature;
        return this.callerUrl;
    }
}