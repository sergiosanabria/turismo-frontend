import {Component} from '@angular/core';

import {AtraccionesPage} from "../atracciones/atracciones";
import {NoticiasPage} from "../noticias/noticias";
import {AgendasPage} from "../agendas/agendas";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = AtraccionesPage;
    tab2Root: any = AgendasPage;
    tab3Root: any = NoticiasPage;

    constructor() {

    }
}
