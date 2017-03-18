import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import { RouterExtensions } from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
import * as appSettings from "application-settings"
import { TokenService } from "../../services/token.service";
import { ParentInfo } from "../../providers/data/parent_info";
import { ParentService } from "../../services/parent_service";
import { ServerErrorService } from "../../services/server.error.service";
import firebase = require("nativescript-plugin-firebase");
let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'settings-page',
    templateUrl: './settings.page.html',
    styleUrls: ["./settings.css"],
    providers: [ ParentService, ServerErrorService ]
})
export class SettingsComponent implements OnInit{
    public isLoading: Boolean = false;

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private parentService: ParentService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService,
                private router: Router) {

    }

    ngOnInit(){
        // show alert if no internet connection
    }

    goBack(){
       // this.routerExtensions.backToPreviousPage();
        this.routerExtensions.navigate(["/home"], {
            transition: {
                name: "slideRight"
            }
        });
    }

    getTour(){
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "fromSettingsPage": true
            }
        };
        this.router.navigate(["tour"], navigationExtras);
    }



    logOut() {
        //TODO remove this 
        this.isLoading = true; 
        this.parentService.logOff()
            .subscribe(
                (result) => {
                    // clear teacher accessToke, authToken and details
                   this.clearSession();
                    var options = {
                        text: 'Logged out successfully',
                        duration: nstoasts.DURATION.SHORT
                    };
                    nstoasts.show(options);
                    this.isLoading = false;
                    // redirect to login page
                    this.routerExtensions.navigate(["/verify-email"], {
                        transition: {
                            name: "slideBottom"
                        },
                        clearHistory: true
                    });

                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    clearSession(){
        //unsubscribe from push notificaitons
        firebase.unsubscribeFromTopic("tingr_"+ParentInfo.parsedDetails.profile.kl_id);
        TokenService.authToken = '';
        TokenService.accessToken = '';
        ParentInfo.details = '';
        appSettings.clear();
    }
}
