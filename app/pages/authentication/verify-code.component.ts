import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {Page} from "ui/page";
import {ServerErrorService} from "../../services/server.error.service";
import { TokenService } from "../../services/token.service";
import { ParentService } from "../../services/parent_service";
import { ParentInfo } from "../../providers/data/parent_info";
import { SharedData } from "../../providers/data/shared_data";
import dialogs = require("ui/dialogs");
import { SnackBar, SnackBarOptions } from "nativescript-snackbar";
import { isAndroid } from "platform";

var app = require("application");
var view = require("ui/core/view");

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [ServerErrorService, ParentService],
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
                private vcRef: ViewContainerRef,
                private parentService: ParentService,
                private sharedData: SharedData,
                private serverErrorService: ServerErrorService) {

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
            this.isLoading = true;
            this.parentService.verifyCode(this.verificationCode)
                .subscribe(
                    (result) => {
                        this.isLoading = false;
                        // set userVerified in app settings
                        TokenService.userVerified = true;
                        // check for tour
                        let navigateTo = 'home';
                        let parentDetails =  ParentInfo.parsedDetails;
                        if(parentDetails.onboarding){
                            if(parentDetails.onboarding_tour && parentDetails.onboarding_tour.length){
                                navigateTo = 'org-tour';
                                this.sharedData.orgTourUrl =  parentDetails.onboarding_tour;
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
                        let snackbar = new SnackBar();
                        let options: SnackBarOptions = {
                            actionText: 'Ok',
                            actionTextColor: '#3daee3',
                            snackText: error.message,
                            hideDelay: 3500
                        };
                        snackbar.action(options);

                        //this.serverErrorService.showErrorModal();
                    }
                );
        }
    }

    resend(){
        this.isLoading = true;
        this.parentService.resendCode()
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    if(isAndroid){
                        let snackbar = new SnackBar();
                        let options: SnackBarOptions = {
                            actionText: 'Ok',
                            actionTextColor: '#3daee3',
                            snackText: result.message,
                            hideDelay: 3500
                        };
                        snackbar.action(options);
                    }else{
                        dialogs.alert({
                            title: "",
                            message: result.message,
                            okButtonText: "Ok"
                        }).then(()=> { });
                    }
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

}