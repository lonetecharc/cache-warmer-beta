
console.log('Now do the same in TS');

import config = require('config');
import { Observable } from 'rxjs/Rx';
import { Show } from './model/shows';
import { CollectionDetails } from './model/collectiondetails';
import { ShowList } from './lib/showlist';
import { ShowCollectionDetails } from './lib/showcollectiondetails';
import { Promise } from 'es6-promise';
import { onlyUnique } from './util/filterunique'
import * as moment from 'moment';
import * as fs from 'fs';

import { MixPanelReader } from './mp/read';
import { HttpCallStatus } from './model/generic';
import { HttpCaller } from './lib/httpcaller';

import { Warmer } from './lib/warmer';

type Falsey = '' | false | null | undefined;
const isReadFromMixpanel : any = config.get('FromMixpanel');

function checkRead(readFromMixpanel : string | Falsey){
    return readFromMixpanel ? true : false;
}

if(checkRead(isReadFromMixpanel)){
    console.log('Reading Mixpanel.. ');

    const warmer = new Warmer(
        config.get('key').toString(),
        config.get('secret').toString(),
        new HttpCaller()
    );
    const eventQueryDate = moment(new Date()).subtract(2,"days").format('YYYY-MM-DD');
    const hourOfTheDay = config.get('Hour_Of_The_Day');
    const minuteOfTheHour = config.get('Minute_of_Hour');

    let resourcesToWarm : string[] = config.get('Resources_To_Warm').toString().split(',');
    console.log('Fetching data for date ' + eventQueryDate + ' at ' + config.get('Hour_Of_The_Day') + ':' + config.get('Minute_of_Hour'));

    resourcesToWarm.forEach(element => {
        let query = `(properties["Event Time: Hour of Day"] == "${hourOfTheDay}")
                     and (properties["Event Time: Minute of Hour"] == "${minuteOfTheHour}")
                     and (properties["Resource"] == "${element}")`;
        warmer.warm(eventQueryDate,query);
    });


    /*let videoQuery = `(properties["Event Time: Hour of Day"] == "12")
                     and (properties["Event Time: Minute of Hour"] == "12:00")
                     and (properties["Resource"] == "videos")`;
     warmer.warm(eventQueryDate,videoQuery);*/

    /*let MP = new MixPanelReader(
        config.get('key').toString(),
        config.get('secret').toString()
    );
    let httpCaller = new HttpCaller();
    let eventQueryDate = moment(new Date()).subtract(2,"days").format('YYYY-MM-DD');
    console.log(eventQueryDate);

    //warm shows
    let showQuery = `(properties["Event Time: Hour of Day"] == "12")
                     and (properties["Event Time: Minute of Hour"] == "12:00")
                     and (properties["Resource"] == "shows")`;
    let urlShowList : Promise<string[]> = MP.getUrls(eventQueryDate, showQuery);
    urlShowList.then(function(urlData){
        urlData.filter(onlyUnique).forEach(function(url){
            httpCaller.makecall('https://api.nbc.com'+url[0]).then(function(warmed){
                console.log('Url to warm: ' + warmed.status + ' : ' + warmed.url);
            })
        });
    });

    //warm videos
    let videosQuery = `(properties["Event Time: Hour of Day"] == "12")
                     and (properties["Event Time: Minute of Hour"] == "12:00")
                     and (properties["Resource"] == "videos")`;
    let urlVideoList : Promise<string[]> = MP.getUrls(eventQueryDate, videosQuery);
    urlVideoList.then(function(urlData){
        urlData.filter(onlyUnique).forEach(function(url){
            httpCaller.makecall('https://api.nbc.com'+url[0]).then(function(warmed){
                console.log('Url to warm: ' + warmed.status + ' : ' + warmed.url);
            })
        });
    });*/


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















