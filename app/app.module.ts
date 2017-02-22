import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { NativeScriptFormsModule } from "nativescript-angular/forms";

import {AppComponent} from "./app.component";
import {SIDEDRAWER_DIRECTIVES} from "nativescript-telerik-ui/sidedrawer/angular";
import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui/listview/angular';
import {APP_ROUTES, authProviders, navigatableComponents} from "./app.routes";

import { ServerErrorService } from "./services/server.error.service"

import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/modal-dialog";
import { ModalServerError } from "./pages/dialogs/modal-server-error";

import { DatePipe } from '@angular/common';

import { ParentInfo } from "./providers/data/parent_info";
import { TokenService } from "./services/token.service";
import {SharedData} from "./providers/data/shared_data"


import { TNSFrescoModule } from "nativescript-fresco/angular";
import * as frescoModule from "nativescript-fresco";
import * as applicationModule from "application";




import { registerElement, ViewClass } from "nativescript-angular/element-registry";
registerElement("CardView", () => require("nativescript-cardview").CardView);
registerElement("PullToRefresh", () => {
    var viewClass = require("nativescript-pulltorefresh").PullToRefresh;
    return viewClass;
});

registerElement("Carousel", () => require("nativescript-carousel").Carousel);
registerElement("CarouselItem", () => require("nativescript-carousel").CarouselItem);
//registerElement("FrescoDrawee", () => frescoModule.FrescoDrawee);

if (applicationModule.android) {
    applicationModule.on("launch", () => {
        frescoModule.initialize();
    });
}



@NgModule({
    declarations: [
        SIDEDRAWER_DIRECTIVES,
        LISTVIEW_DIRECTIVES,
        AppComponent,
        ...navigatableComponents
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        TNSFrescoModule,
        NativeScriptRouterModule.forRoot(APP_ROUTES)
    ],
    providers: [
        ParentInfo,
        TokenService,
        authProviders,
        DatePipe,
        SharedData,
        ModalDialogService,
        ServerErrorService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        ModalServerError
    ]
})
export class AppModule {
}
