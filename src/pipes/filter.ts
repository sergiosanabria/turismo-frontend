import {Injectable, Pipe} from '@angular/core';

@Pipe({
    name: 'filter'
})
@Injectable()
export class Filter {
    /*
     Takes a value and makes it lowercase.
     */
    transform(items: any[], args: string): any {

        //if ( !(typeof items === "undefined") ){
        //    return items.filter((item) => args == "all" || item.tipo_publicacion.indexOf(args) !== -1);
        //}

        if (!(typeof items === "undefined") && !(typeof args === "undefined")) {


            return items.filter((item) => {
                let str = JSON.stringify(item);
                str = str.toLowerCase();
                args = args.toLowerCase();

                return str.indexOf(args) >= 0;

            });
        }
        // filter items array, items which match and return true will be kept, false will be filtered out

    }
}
