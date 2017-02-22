import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {Page} from "ui/page";
import {ServerErrorService} from "../../services/server.error.service";
var app = require("application");
var view = require("ui/core/view");

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [],
    templateUrl: "./verify-code.html",
    styleUrls: ["./authentication.css"]
})

export class FillProfileDetailsComponent implements OnInit {
    isLoading: Boolean = false;
    public firstName: string = '';
    public lastName: string = '';
    public firstNameError: Boolean = false;
    public lastNameError: Boolean = false;
    public selectedImages = [];
    public picUploaded: Boolean = false;

    constructor(private router: Router,
                private routerExtensions: RouterExtensions, private page: Page,
                private vcRef: ViewContainerRef) {

    }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    sendDetails(){
        let fnameField = view.getViewById(this.page, "first-name");
        let lnameField = view.getViewById(this.page, "last-name");
        fnameField.dismissSoftInput();
        lnameField.dismissSoftInput();
        let hasErrors = false;
        if(this.firstName === ''){
            this.firstNameError = true;
            hasErrors = true;
        }
        if(this.lastName === ''){
            this.lastNameError = true;
            hasErrors = true;
        }
        if(hasErrors){
            return;
        }else{

        }
    }


}