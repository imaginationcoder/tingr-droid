import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {Component, OnInit } from "@angular/core";
import {Page} from "ui/page";
import dialogs = require("ui/dialogs");
var view = require("ui/core/view");
var app = require("application");
let tnsfx = require('nativescript-effects');


@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [],
    templateUrl: "./forgot-password.html",
    styleUrls: ["./authentication.css"]
})
export class ForgotPasswordComponent implements OnInit {
    isLoading: Boolean = false;
    public email: string = '';
    public emailError: Boolean = false;


    constructor(private router: Router,
                private route: ActivatedRoute,
                private page: Page,
                private routerExtensions: RouterExtensions) {

    }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }


    goBack() {
        this.routerExtensions.backToPreviousPage();
    }


    sendEmail() {
        let emailField = view.getViewById(this.page, "email");
        emailField.dismissSoftInput();
        let hasErrors = false;
        if(this.email === ''){
            this.emailError = true;
            hasErrors = true;
        }
        if(hasErrors){
            return;
        }else{

        }
    }



}