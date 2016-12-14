import config = require("config");
import * as moment from "moment";
import * as colors from "colors";
import { MixPanelReader } from "../mp/read";
import { HttpCaller } from "../lib/httpcaller";
import { onlyUnique } from "../util/filterunique";
import { MpEvent } from "../model/mpevent";

export class Warmer {

    private MP: MixPanelReader;
    private urlList: Promise<MpEvent[]>;
    private httpCaller: HttpCaller;
    constructor(caller) {
        this.MP = new MixPanelReader(
            config.get("key").toString(),
            config.get("secret").toString()
        );
        this.httpCaller = caller;
    }

    warm(eventQueryDate: string, showQuery: string): void {
        let caller = this.httpCaller;
        this.MP.getUrls(eventQueryDate, showQuery)
                .then(function(mpData){
                    if (mpData !== undefined) {
                        mpData.forEach(function(mp){
                            if (mp.url[0] !== undefined) {
                                let callerUrlGreaterThanReplaced = mp.url[0].replace(">", "%3E");
                                let callerUrlLesserThanReplaced = callerUrlGreaterThanReplaced.replace("<", "%3C");
                                setTimeout(function() {
                                    caller.makecall("https://api.nbc.com"+callerUrlLesserThanReplaced).then(function(warmed){
                                        console.log(colors.rainbow("********************************************************"))
                                        console.log(colors.blue("Url:: " + warmed.url));
                                        console.log(colors.cyan("Resource URL called :: " + callerUrlLesserThanReplaced));
                                        console.log(colors.grey("Resource:: " + mp.resource));
                                        console.log(colors.magenta("Status:: " + warmed.status));
                                        console.log(colors.green("Environment:: " + mp.enviroment));
                                        console.log(colors.yellow("Logged On:: " + moment.unix(mp.time).format("YY-MM-DD HH:mm:ss")));
                                        console.log(colors.red("Error:: " + mp.error));
                                    });
                                }, 10000);

                            }else {
                                console.log("NO URL FOUND TO WARM BEACUSE OF MIXPANEL ISSUE #TYPE1:: " + mp.error);
                            }
                        });
                    }
                    else {
                        console.log("NO URL FOUND TO WARM BEACUSE OF NO URL RETURNED FOR SET FILTERS ");
                    }
                })
                .catch(function(err){
                    console.log(colors.red("issue with Mixpanel read.." + err));
                });
    }
}