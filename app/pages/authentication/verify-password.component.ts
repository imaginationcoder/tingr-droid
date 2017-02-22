import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from 'nativescript-angular/router';
import {Page} from "ui/page";

import { ServerErrorService } from "../../services/server.error.service";
import { SharedData } from "../../providers/data/shared_data";
import { LoginService } from "../../services/login.service";
import { TokenService } from "../../services/token.service";
import { ParentInfo } from "../../providers/data/parent_info";
import dialogs = require("ui/dialogs");
let app = require("application");
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [ ServerErrorService, LoginService],
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
                private loginService: LoginService,
                private sharedData: SharedData,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {

        this.email = this.sharedData.email;
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
            this.isLoading = true;
            this.loginService.signInUser(this.email, this.password)
                .subscribe(
                    (result) => {
                        this.isLoading = false;
                        let body = result.body;
                        console.log("signInUser Response: "+ JSON.stringify(body));
                        TokenService.authToken = body.auth_token;
                        // save parent info in app-settings to invoke rest api's ..
                        ParentInfo.details = JSON.stringify(body);
                        // check onboarding => tour or org_tour
                        let navigateTo = 'home';
                        if(body.onboarding){
                            if(body.onboarding_tour && body.onboarding_tour.length){
                                navigateTo = 'org_tour';
                                this.sharedData.orgTourUrl =  body.onboarding_tour;
                            }
                        }
                        this.routerExtensions.navigate(["/"+navigateTo],
                            {
                                transition: {name: "slideLeft"},
                                clearHistory: true
                            });

                    },
                    (error) => {
                        this.isLoading = false;
                        console.log("signInUser Error: "+ JSON.stringify(error));
                        alert(error.message);
                        //this.serverErrorService.showErrorModal();
                    }
                );
        }


    }

}
