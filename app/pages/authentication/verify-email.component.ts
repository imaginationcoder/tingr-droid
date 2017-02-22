import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {Page} from "ui/page";
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
    //email = 'teacher1@org1.com';
    email = '';
    isLoading: Boolean = false;
    public emailError: Boolean = false;
    /* public emailTextField = view.getViewById(this.page, "email");*/

    //@ViewChild("formErrors") formErrorsRef: ElementRef;


    constructor(private router: Router,
                private routerExtensions: RouterExtensions, private page: Page,
                private vcRef: ViewContainerRef) {

    }

    ngOnInit() {

    }
}