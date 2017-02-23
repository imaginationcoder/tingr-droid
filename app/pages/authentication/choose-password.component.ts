import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from 'nativescript-angular/router';
import {Page} from "ui/page";
import { SharedData } from "../../providers/data/shared_data";
import { LoginService } from "../../services/login.service";

import {ServerErrorService} from "../../services/server.error.service";
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
            alert('Password mismatch');
            return;
        }

        if(hasErrors){
            return;
        }else{
            console.log("bbbbb "+ this.sharedData.afterEmailNavigateTo);
            if(this.sharedData.afterEmailNavigateTo === 'signup'){
                // save pass in shareddata to available in next pages
                this.sharedData.email = this.email;
                this.sharedData.password = this.password;
                this.routerExtensions.navigate(["/fill-profile"], {
                    transition: {
                        name: "slideLeft"
                    },
                });
            }
        }
    }

}
