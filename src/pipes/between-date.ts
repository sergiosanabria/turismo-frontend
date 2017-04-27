import {Injectable, Pipe} from '@angular/core';

@Pipe({
    name: 'betweendate'
})
@Injectable()
export class BetweenDate {
    /*
     Takes a value and makes it lowercase.
     */
    transform(items: any[], args: string): any {

        console.log(args);
        console.log(items);

        if (!(typeof items === "undefined") && !(typeof args === "undefined")) {


            return items.filter((item) => {

                let date = new Date(args);
                let desde = new Date(item.fecha_rango.desde);
                let hasta = new Date(item.fecha_rango.hasta);

                return date >= desde && date <= hasta;

            });
        }
        // filter items array, items which match and return true will be kept, false will be filtered out

    }
}
