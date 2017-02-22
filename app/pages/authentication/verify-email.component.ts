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
    templateUrl: "./verify-email.html",
    styleUrls: ["./authentication.css"]
})

export class VerifyEmailComponent implements OnInit {
    isLoggingIn = false;
    isLoading: Boolean = false;
    public email: string = '';
    public emailError: Boolean = false;

    constructor(private router: Router,
                private routerExtensions: RouterExtensions, private page: Page,
                private vcRef: ViewContainerRef) {

    }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    submitEmail() {
        let emailField = view.getViewById(this.page, "email");
        emailField.dismissSoftInput();
        let hasErrors = false;
        if (this.email === '') {
            this.emailError = true;
            hasErrors = true;
        }
        if (hasErrors) {
            return;
        } else {
            this.routerExtensions.navigate(["/verify-password"],
                {
                    transition: {name: "flip"}
                });
        }


    }
}