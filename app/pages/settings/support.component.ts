import {Component, ViewContainerRef, OnInit} from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";


let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'support-page',
    templateUrl: './support.html',
    styleUrls: ["./settings.css"],
    providers: [ ]
})
export class SupportComponent implements OnInit{
    public isLoading: Boolean = false;

    constructor(private routerExtensions: RouterExtensions,
                private vcRef: ViewContainerRef,
                private router: Router) {

    }

    ngOnInit(){
        // show alert if no internet connection
    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }


}
