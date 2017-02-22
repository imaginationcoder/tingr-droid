import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from 'nativescript-angular/router';
import {Page} from "ui/page";

import {ServerErrorService} from "../../services/server.error.service";
import dialogs = require("ui/dialogs");
let app = require("application");
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [ ServerErrorService],
    templateUrl: "./verify-password.html",
    styleUrls: ["./authentication.css"]
})
export class VerifyPasswordComponent implements OnInit {

    isLoading: Boolean = false;
    public email: string = '';
    public emailError: Boolean = false;
    public password: string = '';
    public passwordError: Boolean = false;
    public emailOrPasswordError: Boolean = false;

    constructor(private router: Router, private route: ActivatedRoute,
                private routerExtensions: RouterExtensions,
                private page: Page,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
    }

    ngOnInit() {
        // show alert if no internet connection
        this.page.actionBarHidden = true;
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }


    signIn() {
        // validate form
        let emailTextField = view.getViewById(this.page, "email");
        let passTextField = view.getViewById(this.page, "password");
        let forgotPassLink = view.getViewById(this.page, "forgotPassLink");
        let hasErrors = false;
        //dismiss input
        emailTextField.dismissSoftInput();
        passTextField.dismissSoftInput();
        if (emailTextField.text === "") {
            this.emailError = true;
            hasErrors = true;
        }
        if (passTextField.text === "") {
            this.passwordError = true;
            hasErrors = true;
        }

        if(hasErrors){
            return;
        }else{

        }


    }

}
