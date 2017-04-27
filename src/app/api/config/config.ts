import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import {parameters} from "./parameters";

@Injectable()
export class Config {

    private config: Object;
    constructor(private http: Http) {
        this.config = parameters
    }
    
    load() {

    }

    get(key: any) {
        return this.config[key];
    }

}
