import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/Rx';
import {ApiHandler} from './ApiHandler';
import {ResponseCallback} from './ResponseCallback';
import {Config} from "./config/config";



/**
 * Interfaz de bajo nivel de la API
 */
@Injectable()
export class ApiService {
    private apiUrl: string;
    private apiHandler: ApiHandler;
    private http: Http;
    private _config: Config

    constructor() {

        this.apiUrl = this._config.get('apiUrl');

        // console.log(this.apiUrl);

        this.apiHandler = new ApiHandler();
    }

    /**
     *
     */
    public get(endpoint: string, params: any | ResponseCallback, successHandler?: ResponseCallback, errorHandler?: ResponseCallback): any {
        if (typeof params === 'function') {
            errorHandler = successHandler;
            successHandler = params;
            params = {};
        }

        let search = new URLSearchParams();

        for (let k in params) {
            if (k == 'fields') {
                search.set(k, JSON.stringify(params[k]));
            } else {
                search.set(k, params[k]);
            }
        }

        let options = new RequestOptions({
            withCredentials: true,
            search: search
        });

        let response = this.http.get(this.apiUrl + endpoint, options);

        return this.apiHandler.genericHandleResponse(response, successHandler, errorHandler);
    }

}
