import {Component, ViewContainerRef, OnInit, ChangeDetectorRef} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from 'nativescript-angular/router';
import {Page} from "ui/page";
import * as appSettings from "application-settings"

import {ServerErrorService} from "../../services/server.error.service";
import {ParentService} from "../../services/parent_service";
import {TokenService} from "../../services/token.service";
import {ParentInfo} from "../../providers/data/parent_info";
import dialogs = require("ui/dialogs");
let app = require("application");
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');

let nstoasts = require("nativescript-toasts");

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [ServerErrorService, ParentService],
    templateUrl: "./home.html",
    styleUrls: ["./home.css"]
})
export class HomeComponent extends DrawerPage implements OnInit {
    isLoading: Boolean = false;
    public parentProfile: any;
    public emptyNoteMessage: string;


    constructor(private changeDetectorRef: ChangeDetectorRef,
                private router: Router, private route: ActivatedRoute,
                private routerExtensions: RouterExtensions,
                private page: Page,
                private parentService: ParentService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        super(changeDetectorRef);

        this.parentProfile = ParentInfo.parsedDetails.profile;

        this.emptyNoteMessage = 'while we wait for the school to share your kid moments' +
            'we encourage you to digitally organize your entire family documents now' +
            '- like driving licences, immunity records, insurance cards, son, etc. ';
    }

    ngOnInit() {
        // this.page.actionBarHidden = true;
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    logOff() {
        this.isLoading = true;
        this.parentService.logOff()
            .subscribe(
                (result) => {
                    // clear teacher accessToke, authToken and details
                    TokenService.authToken = '';
                    TokenService.accessToken = '';
                    ParentInfo.details = '';
                    appSettings.clear();
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


}
