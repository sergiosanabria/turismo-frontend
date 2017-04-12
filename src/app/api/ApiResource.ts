import {ApiService} from './ApiService';

/**
 * Representación abstracta de un resource de la API
 */
export class ApiResource {
    protected api: ApiService;

    constructor() {
        this.api = new ApiService();


    }

    public getAll(endpoint: string, params?: any, callback?: any): any {

        console.log(this.api);
        return this.api.get(endpoint, params, callback);
    }

    public get(endpoint: string, id: any, params: any, callback?: any): any {
        return this.api.get(endpoint + '/' + id, params, callback);
    }

    public post(): any {
        return null;
    }

    public put(id: number): any {
        return this.patch(id);
    }

    public patch(id: number): any {
        return null;
    }

    public delete(id: number): any {
        return null;
    }

    /**/
}
