import { UrlCreator } from './urlcreator';
import { CollectionDetails } from '../model/collectiondetails';
import Http = require('http');
import * as axios from 'axios';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'

export class ShowCollectionDetails extends UrlCreator{
    constructor(baseUrl: string, apiSignature: string){
        super(baseUrl,apiSignature);
    }

    makeCall() : Promise<CollectionDetails[]>  { //Observable<Show[]>
        console.log(super.getCallerUrl());

        let response = axios.get(super.getCallerUrl());

        return response.then(res => {
            return this.getShowCollections(res.data);
        });
    }

    private getShowCollections(res) : CollectionDetails[]{
        let showList : CollectionDetails[];
        return res.included.map(function(data){
            let show = <CollectionDetails>{
                collection_type:data.type,
                links_self:data.links.self
            };
            //console.log(show);
            return show;
        });
    }
}












