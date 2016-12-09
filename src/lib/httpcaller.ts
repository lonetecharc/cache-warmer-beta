import * as axios from 'axios';
import {Promise} from 'es6-promise';
import { HttpCallStatus } from '../model/generic';

export class HttpCaller{
    makecall(urlToWarm: string): Promise<HttpCallStatus>{
        let response = axios.get(urlToWarm);

        return response.then(res => {
            let httpCallStatus = <HttpCallStatus>{
                url: urlToWarm,
                status: res.status
            };
            return httpCallStatus;
        });
    }
}