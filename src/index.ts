
console.log('Now do the same in TS');

import config = require('config');
import { Observable } from 'rxjs/Rx';
import { Show } from './model/shows';
import { CollectionDetails } from './model/collectiondetails';
import { ShowList } from './lib/showlist';
import { ShowCollectionDetails } from './lib/showcollectiondetails';
import {Promise} from 'es6-promise';
import * as fs from 'fs';
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















