import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {Api} from "./api/api";
import {AtraccionesPage} from "../pages/atracciones/atracciones";
import {Sync} from "./api/sync";
import {DefaultImageDirective} from "../directives/img/image-default.directive";
import {AtraccionPage} from "../pages/atraccion/atraccion";
import {NoticiasPage} from "../pages/noticias/noticias";
import {NoticiaPage} from "../pages/noticia/noticia";
import {Filter} from "../pipes/filter";
import {DatePickerModule} from 'datepicker-ionic2';
import {AgendasPage} from "../pages/agendas/agendas";
import {BetweenDate} from "../pipes/between-date";
import {AgendaPage} from "../pages/agenda/agenda";
import {MapService} from "../directives/map/map.service";
import {GeocodingService} from "../directives/map/geocode.service";
import {GeosearchComponent} from "../directives/map/geosearch.component";
import {MapComponent} from "../directives/map/map.component";
import {MapaAtraccionPage} from "../pages/mapa-atraccion/mapa-atraccion";
import {Geolocation} from '@ionic-native/geolocation';
import {RutaPage} from "../pages/ruta/ruta";
import {Calendar} from "@ionic-native/calendar";
import {Transfer} from "@ionic-native/transfer";
import {SocialSharing} from "@ionic-native/social-sharing";
import {TextToSpeech} from "@ionic-native/text-to-speech";
import {ApiTranslate} from "./api/api-translate";


@NgModule({
    declarations: [
        MyApp,
        MapComponent,
        GeosearchComponent,
        AboutPage,
        HomePage,
        TabsPage,
        AtraccionesPage,
        AtraccionPage,
        MapaAtraccionPage,
        NoticiasPage,
        NoticiaPage,
        AgendasPage,
        AgendaPage,
        DefaultImageDirective,
        RutaPage,
        Filter,
        BetweenDate
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        DatePickerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        MapComponent,
        GeosearchComponent,
        AboutPage,
        HomePage,
        TabsPage,
        AtraccionPage,
        AtraccionesPage,
        MapaAtraccionPage,
        NoticiasPage,
        NoticiaPage,
        AgendasPage,
        AgendaPage,
        RutaPage

    ],
    providers: [
        Api,
        ApiTranslate,
        Sync,
        GeocodingService,
        Geolocation,
        Calendar,
        MapService,
        Transfer,
        SocialSharing,
        TextToSpeech,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
