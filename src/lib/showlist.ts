import { UrlCreator } from "./urlcreator";
import { Show } from "../model/shows";
import Http = require("http");
import * as axios from "axios";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import {Promise} from "es6-promise";
export class ShowList extends UrlCreator {
    constructor(baseUrl: string, apiSignature: string) {
        super(baseUrl, apiSignature);
    }

    makeCall(): Promise<Show[]>  {
        console.log(super.getCallerUrl());
        let response = axios.get(super.getCallerUrl());
        return response.then(res => {
            return this.getShowAlias(res.data);
        });
    }

    private getShowAlias(res): Show[] {
        let showList: Show[];
        return res.included.map(function(data){
            let show = <Show>{
                id: data.id,
                urlAlias: data.attributes.urlAlias,
                shortTitle: data.attributes.shortTitle
            };
            return show;
        });
    }
}












