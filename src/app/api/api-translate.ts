import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {toPromise} from "rxjs/operator/toPromise";

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class ApiTranslate {
    url: string = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
    key: string = 'trnsl.1.1.20170519T200854Z.95cf1a84685f66ce.ea8b334ba68d3267600cac16f770b8e5184a80da';

    constructor(public http: Http) {
    }


    post(text: string, de: string, a: string) {

        let options = new URLSearchParams();
        options.set('lang', de + '-' + a);
        options.set('key', this.key);
        options.set('text', text);
        return this.http.post(this.url, options).toPromise();
        ;
    }

}
