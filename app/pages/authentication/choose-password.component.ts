import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from 'nativescript-angular/router';
import {Page} from "ui/page";
import { SharedData } from "../../providers/data/shared_data";
import { LoginService } from "../../services/login.service";
import { ParentInfo } from "../../providers/data/parent_info";
import { TokenService } from "../../services/token.service";

import {ServerErrorService} from "../../services/server.error.service";
import { SnackBar, SnackBarOptions } from "nativescript-snackbar";
import { isAndroid } from "platform";

import dialogs = require("ui/dialogs");
let app = require("application");
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [ LoginService,ServerErrorService],
    templateUrl: "./choose-password.html",
    styleUrls: ["./authentication.css"]
})
export class ChoosePasswordComponent implements OnInit {
    isLoading: Boolean = false;
    public email: string = '';
    public password: string = '';
    public confirmPassword: string = '';
    public passwordError: Boolean = false;
    public confirmPasswordError: Boolean = false;

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
        this.page.actionBarHidden = true;
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    signUp(){
        let passsTextfield = view.getViewById(this.page, "password");
        let confirmPassTextfield = view.getViewById(this.page, "confirmPassword");
        passsTextfield.dismissSoftInput();
        confirmPassTextfield.dismissSoftInput();
        let hasErrors = false;
        if(this.password === ''){
            this.passwordError = true;
            hasErrors = true;
        }
        if(this.confirmPassword === ''){
            this.confirmPasswordError = true;
            hasErrors = true;
        }

        if(this.password !== this.confirmPassword){
            this.confirmPasswordError = true;
            this.passwordError = true;
            hasErrors = true;
            if(isAndroid){
                let snackbar = new SnackBar();
                snackbar.simple('Password mismatch')
            }else{
                alert('Password mismatch')
            }
            return;
        }

        if(hasErrors){
            return;
        }else{
            if(this.sharedData.afterEmailNavigateTo === 'signup'){
                // save pass in shareddata to available in next pages
                this.sharedData.email = this.email;
                this.sharedData.password = this.password;
                this.routerExtensions.navigate(["/fill-profile"], {
                    transition: {
                        name: "slideLeft"
                    },
                });
            }else if(this.sharedData.afterEmailNavigateTo === 'create_user'){
                this.isLoading = true;
                this.loginService.signUpUser(this.email,this.password)
                    .subscribe(
                        (result) => {
                            this.isLoading = false;
                            let body = result.body;
                            console.log("signInUser Response: "+ JSON.stringify(body));
                            TokenService.authToken = body.auth_token;
                            TokenService.userVerified = body.verified;
                            // save parent info in app-settings to invoke rest api's ..
                            ParentInfo.details = JSON.stringify(body);
                            // check onboarding => tour or org_tour
                            let navigateTo = 'home';
                            if(body.verified === false){
                                navigateTo = 'verify-code';
                            }else if(body.onboarding){
                                if(body.onboarding_tour && body.onboarding_tour.length){
                                    navigateTo = 'org-tour';
                                    this.sharedData.orgTourUrl =  body.onboarding_tour;
                                }else{
                                    navigateTo = 'tour';
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
                            if(isAndroid){
                                let snackbar = new SnackBar();
                                let options: SnackBarOptions = {
                                    actionText: 'Ok',
                                    actionTextColor: '#3daee3',
                                    snackText: error.message,
                                    hideDelay: 3500
                                };
                                snackbar.action(options);
                            }else{
                                dialogs.alert({
                                    title: "",
                                    message: error.message,
                                    okButtonText: "Ok"
                                }).then(()=> { });
                            }
                        }
                    );

            }
        }
    }

}
