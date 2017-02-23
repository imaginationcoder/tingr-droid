import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {Component, OnInit } from "@angular/core";
import {Page} from "ui/page";
import { LoginService } from "../../services/login.service";
import { SharedData } from "../../providers/data/shared_data";
import dialogs = require("ui/dialogs");
var view = require("ui/core/view");
var app = require("application");
let tnsfx = require('nativescript-effects');


@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [LoginService],
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
                private loginService: LoginService,
                private sharedData: SharedData,
                private routerExtensions: RouterExtensions) {
        this.email = this.sharedData.email;

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
            this.isLoading = true;
            this.loginService.forgotPassword(this.email)
                .subscribe(
                    (result) => {
                        this.isLoading = false;
                        dialogs.confirm({
                            title: "",
                            message: result.message,
                            okButtonText: "Ok",
                            cancelButtonText: "Sign In"
                        }).then(result => {
                            if(result === false) {
                                this.sharedData.email = this.email;
                                this.routerExtensions.navigate(["/verify-password"], {
                                    transition: {
                                        name: "slideRight"
                                    },
                                });
                            }
                        });
                    },
                    (error) => {
                        this.isLoading = false;
                        dialogs.alert({
                            title: "",
                            message: error.message,
                            okButtonText: "Ok"
                        }).then(()=> {
                        });
                    }
                );
        }
    }



}