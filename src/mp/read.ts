const MixpanelExport = require('mixpanel-data-export-node');
export class MixPanelReader{
    /**
     *
     */
    panel: any;

    constructor(apiKey:string, apiSecret:string) {
        this.panel = new MixpanelExport({
            api_key: apiKey,
            api_secret: apiSecret
        });
    }

    getUrls(dateRange: string, whereClause: string): Promise<string[]>{
        return this.panel.export({
            from_date: dateRange,
            to_date: dateRange,
            event: ["API Request"],
            where:  whereClause
            }).then(function(data) {
                 return data.map(x=> {
                        console.log(x.properties.URL)
                        return  x.properties.URL;
                });
        }).catch(function(data){
            console.log('in MP read');
        });
    }
}