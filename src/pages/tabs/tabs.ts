import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {LugaresPage} from "../lugares/lugares";
import {NoticiasPage} from "../noticias/noticias";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = LugaresPage;
    tab2Root: any = AboutPage;
    tab3Root: any = NoticiasPage;

    constructor() {

    }
}
