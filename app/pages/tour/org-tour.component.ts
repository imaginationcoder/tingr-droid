import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "ui/page";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {ServerErrorService} from "../../services/server.error.service";
import { SharedData } from "../../providers/data/shared_data";
import 'nativescript-pdf-view';
let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'tour-page',
    templateUrl: './org-tour.html',
    providers: [ServerErrorService]
})
export class OrgTourComponent implements OnInit {
    public isLoading: Boolean = false;
    public orgTourUrl: string = '';
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;

    constructor(
                private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private router: Router,
                private vcRef: ViewContainerRef,
                private page: Page,
                private sharedData: SharedData,
                private serverErrorService: ServerErrorService) {
        this.orgTourUrl = this.sharedData.orgTourUrl;
        if (app.android) {
            this.isAndroid = true;
        } else if (app.ios) {
            this.isIos = true;
        }
    }

    ngOnInit() {
        // show alert if no internet connection
    }

    next() {
        this.routerExtensions.navigate(["/home"],
            {
                transition: {name: "slideLeft"},
                clearHistory: true
            });
    }


}
