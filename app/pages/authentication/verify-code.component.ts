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

export class VerifyCodeComponent implements OnInit {
    isLoggingIn = false;
    isLoading: Boolean = false;
    public verificationCode: string = '';
    public verificationCodeError: Boolean = false;

    constructor(private router: Router,
                private routerExtensions: RouterExtensions, private page: Page,
                private vcRef: ViewContainerRef) {

    }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    verify() {
        let verificationCodeField = view.getViewById(this.page, "verification-code");
        verificationCodeField.dismissSoftInput();
        let hasErrors = false;
        if (this.verificationCode === '') {
            this.verificationCodeError = true;
            hasErrors = true;
        }
        if (hasErrors) {
            return;
        } else {

        }
    }

    resend(){

    }

}