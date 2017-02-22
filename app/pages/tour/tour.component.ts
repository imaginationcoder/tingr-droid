import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "ui/page";
import {Router,  ActivatedRoute} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {ServerErrorService} from "../../services/server.error.service";

let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'tour-page',
    templateUrl: './tour.html',
    styleUrls: ["./tour.css"],
    providers: [  ServerErrorService ]
})
export class TourComponent implements OnInit{
    public isLoading: Boolean = false;
    public fromSettingsPage: Boolean = false;

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private router: Router,
                private vcRef: ViewContainerRef,
                private page: Page,
                private serverErrorService: ServerErrorService) {

        // get the conversationId from navigation params if this page is open from schedule
        this.route.queryParams.subscribe(params => {
            this.fromSettingsPage = params["fromSettingsPage"];
        });

    }

    ngOnInit(){
        // show alert if no internet connection
        this.page.actionBarHidden = true;
    }

    skip(){
        if(this.fromSettingsPage){
            this.routerExtensions.navigate(["/settings"],
                {
                    transition: {name: "slideTop"}
                });
        }else{
            this.routerExtensions.navigate(["/home"],
                {
                    transition: {name: "slideLeft"},
                    clearHistory: true
                });
        }
    }



}
