import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {Page} from "ui/page";
import {ServerErrorService} from "../../services/server.error.service";
import {TokenService} from "../../services/token.service";
import {AuthService} from "../../services/oauth/auth.service";
import { LoginService } from "../../services/login.service";
import { SharedData } from "../../providers/data/shared_data";
var app = require("application");
var view = require("ui/core/view");

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [AuthService,ServerErrorService, LoginService],
    templateUrl: "./verify-email.html",
    styleUrls: ["./authentication.css"]
})

export class VerifyEmailComponent implements OnInit {
    isLoggingIn = false;
    isLoading: Boolean = false;
    public email: string = 'qamaisa@gmail.com';
    public emailError: Boolean = false;

    constructor(private router: Router,
                private loginService: LoginService,
                private authService: AuthService,
                private sharedData: SharedData,
                private serverErrorService: ServerErrorService,
                private routerExtensions: RouterExtensions, private page: Page,
                private vcRef: ViewContainerRef) {

    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        // get AccessToken
        if (!!TokenService.accessToken === false) {
            //this.isLoading = true;
            this.authService.getAccessToken()
                .subscribe(
                    (result) => {
                        // save accessToken in appSettings and authData
                        TokenService.accessToken = result.access_token;
                        TokenService.accessTokenExpiry = result.expires_in;
                        //this.isLoading = false;
                    },
                    (error) => {
                        //this.isLoading = false;
                        this.serverErrorService.showErrorModal();
                    }
                );
        }

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
            this.isLoading = true;
            // save email in shared data to pass to next screens
            this.sharedData.email = this.email;
            this.loginService.evaluteUser(this.email)
                .subscribe(
                    (result) => {
                        this.isLoading = false;
                        let body = result.body;
                        console.log("evalute User Response: "+ JSON.stringify(body));
                        let navigateTo = '';
                        // if signup --choose pass then profile fill
                        // if create_user -- choose pass and singIn the user
                        this.sharedData.afterEmailNavigateTo = body.goto;
                        switch (body.goto) {
                            case 'login':
                                navigateTo = '/verify-password';
                                break;
                            case 'signup':
                                navigateTo = '/choose-password';
                                break;
                            case 'create_user':
                                navigateTo = '/choose-password';
                                break;
                        }

                        this.routerExtensions.navigate([navigateTo], {
                            transition: {
                                name: "flip",
                                duration: 500
                            },
                        });

                    },
                    (error) => {
                        this.isLoading = false;
                       // this.serverErrorService.showErrorModal();
                    }
                );

        }


    }
}