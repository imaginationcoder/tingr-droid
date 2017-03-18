import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Page} from "ui/page";
import {RouterExtensions} from 'nativescript-angular/router';
import {ParentService} from "../../services/parent_service";
import {ServerErrorService} from "../../services/server.error.service";
import dialogs = require("ui/dialogs");
let view = require("ui/core/view");
let nstoasts = require("nativescript-toasts");
let app = require("application");


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: './change-password.html',
    styleUrls: ["./change-password.css"],
    providers: [ParentService, ServerErrorService]
})
export class ChangePasswordComponent implements OnInit {
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public showActionBarItems: Boolean = false;

    public currentPassword: string = '';
    public newPassword: string = '';
    public confirmPassword: string = '';
    public currentPasswordError: Boolean = false;
    public newPasswordError: Boolean = false;
    public confirmPasswordError: Boolean = false;

    constructor(private page: Page, private location: Location,
                private routerExtensions: RouterExtensions,
                private parentService: ParentService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
 
    }

    ngOnInit() {
        // show alert if no internet connection
        //this.internetService.alertIfOffline();
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    updatePassword() {
        // validate form
        let currentPassTextfield = view.getViewById(this.page, "currentPassword");
        let newPassTextfield = view.getViewById(this.page, "newPassword");
        let confirmPassTextfield = view.getViewById(this.page, "confirmPassword");
        currentPassTextfield.dismissSoftInput();
        newPassTextfield.dismissSoftInput();
        confirmPassTextfield.dismissSoftInput();
        let hasErrors = false;
        if(this.currentPassword === ''){
            this.currentPasswordError = true;
            hasErrors = true;
        }
        if(this.newPassword === ''){
            this.newPasswordError = true;
            hasErrors = true;
        }
        if(this.confirmPassword === ''){
            this.confirmPasswordError = true;
            hasErrors = true;
        }

        if(hasErrors){
            return;
        }else{
            this.isLoading = true;
            this.parentService.updatePassword(this.currentPassword,this.newPassword,this.confirmPassword)
                .subscribe(
                    (result) => {
                        var options = {
                            text: result.message,
                            duration : nstoasts.DURATION.SHORT
                        };
                        nstoasts.show(options);
                        this.isLoading = false;
                        this.routerExtensions.backToPreviousPage();
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
