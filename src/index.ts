
console.log('Now do the same in TS');

import config = require('config');
import { Observable } from 'rxjs/Rx';
import { Show } from './model/shows';
import { CollectionDetails } from './model/collectiondetails';
import { ShowList } from './lib/showlist';
import { ShowCollectionDetails } from './lib/showcollectiondetails';
import { Promise } from 'es6-promise';
import { onlyUnique } from './util/filterunique'
import * as fs from 'fs';

import { MixPanelReader } from './mp/read';
import { HttpCallStatus } from './model/generic';
import { HttpCaller } from './lib/httpcaller';

type Falsey = '' | false | null | undefined;
const isReadFromMixpanel : any = config.get('FromMixpanel');

function checkRead(readFromMixpanel : string | Falsey){
    return readFromMixpanel ? true : false;
}

if(checkRead(isReadFromMixpanel)){
    console.log('Reading Mixpanel.. ');
    let MP = new MixPanelReader(
        config.get('key').toString(),
        config.get('secret').toString()
    );
    let httpCaller = new HttpCaller();
    let urlList : Promise<string[]> = MP.getUrls('(properties["Resource"] == "shows" or properties["Resource"] == "videos" or properties["Resource"] == "collections") and (properties["Cached in Redis"] == "True") and (properties["Event Time: Minute of Hour"] == "15:00")');
    urlList.then(function(urlData){
        urlData.filter(onlyUnique).forEach(function(url){
            httpCaller.makecall('https://api.nbc.com'+url[0]).then(function(warmed){
                console.log('Url to warm: ' + warmed.status + ' : ' + warmed.url);
            })
        });
    });


}else{
    var list = new ShowList(
        config.get('API.park.urlPUB7').toString(),
        config.get('APISignature.globalnavShows').toString()
        );

    let showlist : Promise<Show[]>;
    showlist = list.makeCall();

    fs.writeFileSync(__dirname + '/cachewarmlog.txt','Satrting Cache Warm at ' + new Date().toJSON().slice(0,10) + '\n');

    showlist.then(function(d){
        console.log('********************Warming started*****************');
        fs.appendFile(__dirname + '/cachewarmlog.txt','got show list' + '\n');
        d.forEach(function(show){
            console.log(show.urlAlias);
            let showCollectionDetails = new ShowCollectionDetails(
                config.get('API.park.urlPUB7').toString(),
                config.get('APISignature.showDetail').toString().replace('<SHOW_NAME>',show.urlAlias)
            );

            let collectionList : Promise<CollectionDetails[]>;
            collectionList = showCollectionDetails.makeCall();

            collectionList.then(function(d){
                console.log(d);
                fs.appendFile(__dirname + '/cachewarmlog.txt', show.urlAlias + ' warmed:: ' + JSON.stringify(d) + '\n');
            });
        })
    });
}















