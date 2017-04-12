import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {Api} from "./api/api";
import {LugaresPage} from "../pages/lugares/lugares";
import {Sync} from "./api/sync";
import {DefaultImageDirective} from "../directives/img/image-default.directive";
import {LugarPage} from "../pages/lugar/lugar";
import {NoticiasPage} from "../pages/noticias/noticias";
import {NoticiaPage} from "../pages/noticia/noticia";
import {Filter} from "../pipes/filter";


@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        LugaresPage,
        LugarPage,
        NoticiasPage,
        NoticiaPage,
        DefaultImageDirective,
        Filter
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        LugarPage,
        LugaresPage,
        NoticiasPage,
        NoticiaPage

    ],
    providers: [
        Api,
        Sync,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
