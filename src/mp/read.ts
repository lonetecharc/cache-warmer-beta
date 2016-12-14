const MixpanelExport = require("mixpanel-data-export-node");
import { MpEvent } from "../model/mpevent";

export class MixPanelReader {
    /**
     *
     */
    panel: any;

    constructor(apiKey: string, apiSecret: string) {
        this.panel = new MixpanelExport({
            api_key: apiKey,
            api_secret: apiSecret
        });
    }

    getUrls(dateRange: string, whereClause: string): Promise<MpEvent[]> {
        let oCheckValBeforeReturn = this.checkUndefinedOrHasValue;
        return this.panel.export({
            from_date: dateRange,
            to_date: dateRange,
            event: ["API Request"],
            where:  whereClause
            }).then(function(data) {
                 return data.map(x => {
                        if (x.properties !== undefined) {
                            let mpevent = <MpEvent>{
                                enviroment : oCheckValBeforeReturn(x.properties.Environment),
                                resource: oCheckValBeforeReturn(x.properties.Resource),
                                url: oCheckValBeforeReturn(x.properties.URL),
                                version: oCheckValBeforeReturn(x.properties.Version),
                                time: oCheckValBeforeReturn(x.properties.time),
                                error: oCheckValBeforeReturn(x.error)
                            };
                            return  mpevent;
                        }else {
                            let mpErrEvent = <MpEvent>{
                                enviroment : "",
                                resource: "",
                                url: "",
                                version: "",
                                time: 0,
                                error: oCheckValBeforeReturn(x.error)
                            };
                            return  mpErrEvent;
                        }
                });
            }).catch(function(data){
                console.log("issue with MP read " + data);
            });
    }

    checkUndefinedOrHasValue(val): any {
        let op = val === "undefined" ? "" : val;
        return op;
    }
}