import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {Page} from "ui/page";
import {ServerErrorService} from "../../services/server.error.service";
import { SharedData } from "../../providers/data/shared_data";
import { LoginService } from "../../services/login.service";
import { ParentService } from "../../services/parent_service";
import { ParentInfo } from "../../providers/data/parent_info";
import { TokenService } from "../../services/token.service";


let platformModule = require("platform");
let permissions = require("nativescript-permissions");
let cameraModule = require("camera");
import {GC} from 'utils/utils';
let enums = require("ui/enums");
let imagepicker = require("nativescript-imagepicker");
import dialogs = require("ui/dialogs");
let nstoasts = require("nativescript-toasts");
var app = require("application");
var view = require("ui/core/view");
declare var android: any;

@Component({
    moduleId: module.id,
    selector: "my-app",
    providers: [ServerErrorService, LoginService, ParentService],
    templateUrl: "./fill-profile.html",
    styleUrls: ["../authentication/authentication.css"]
})

export class FillProfileComponent implements OnInit {
    isLoading: Boolean = false;
    public email: string = '';
    public password: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public firstNameError: Boolean = false;
    public lastNameError: Boolean = false;
    public selectedImages = [];
    public picUploaded: Boolean = false;
    public uploadedPicId: string = '';

    constructor(private router: Router,
                private routerExtensions: RouterExtensions, private page: Page,
                private loginService: LoginService,
                private parentService: ParentService,
                private sharedData: SharedData,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        this.email = this.sharedData.email;
        this.password = this.sharedData.password;


    }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    selectPictureOption(){
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Take photo", "Choose existing"]
        }).then(result => {
            if (result === 'Take photo') {
                //  Android permissions (mainly for API 23+/Android 6+) check inplace
                // This wraps up the entire Android 6 permissions system into a nice easy to use promise.
                // In addition, you can also have multiple permissions pending and each one will resolve properly
                if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
                    permissions.requestPermission(android.Manifest.permission.CAMERA, "Allow Tingr to access your camera?")
                        .then(() => {
                            //console.log("CAMERA Permission: granted!");
                            this.takePicture();
                        })
                        .catch(() => {
                            //console.log("CAMERA Permission: -- refused");
                        });
                } else {
                    this.takePicture();
                }

            } else if (result === 'Choose existing') {
                if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
                    permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "Allow Tingr to access your gallery?")
                        .then(() => {
                            //console.log("READ_EXTERNAL_STORAGE permission: granted!");
                            this.selectFromGallery();
                        })
                        .catch(() => {
                            //console.log("READ_EXTERNAL_STORAGE permission: -- refused");
                        });
                } else {
                    this.selectFromGallery();
                }
            }
        });
    }



    takePicture() {
        let teacherProfilePicView = view.getViewById(this.page, 'parentProfilePic');
        let options = {
            saveToGallery: false
        };
        cameraModule.takePicture(options).then((imageAsset) => {
            let imageBase64Data =  imageAsset.toBase64String(enums.ImageFormat.jpeg);
            this.picUploaded = true; 
            teacherProfilePicView.src = imageAsset; 
            this.uploadPicture(imageBase64Data);
            GC();
        });
    }

    selectFromGallery() {
        let context = imagepicker.create({
            mode: "single"
        });
        this.startImageSelection(context);
    }

    startImageSelection(context) {
        let teacherProfilePicView = view.getViewById(this.page, 'parentProfilePic');

        context
            .authorize()
            .then(() => {
                return context.present();
            })
            .then((selection) => {
                //console.log("Selection done:");
                selection.forEach((selected) => {
                    //TODO for multiple seelction follow below coding for each one
                    // console.log("----------------");
                    // console.log("uri: " + selected.uri);
                    // console.log("fileUri: " + selected.fileUri);
                });
                this.selectedImages = selection;
                // this.changeDetectionRef.detectChanges();
                let selectedImage = this.selectedImages[0];
                selectedImage
                    .getImage()
                    .then((imageSource) => {
                        let imageBase64Data = imageSource.toBase64String(enums.ImageFormat.jpeg);
                        this.picUploaded = true; 
                        teacherProfilePicView.src = imageSource; 
                        this.uploadPicture(imageBase64Data);

                    }).catch((e) => {
                    //console.log("Error: " + e);
                    //console.log(e.stack);
                });
                GC();
            }).catch((e) => {
            //console.log(e);
        });

    }

    uploadPicture(imageBase64Data){
        this.parentService.uploadPicture(imageBase64Data)
            .subscribe(
                (result) => {
                    let body = result.body;
                    console.log("Upload to s3 result "+ JSON.stringify(result))
                    this.uploadedPicId = body.document.kl_id;
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    submitDetails(){
        let fnameField = view.getViewById(this.page, "first-name");
        let lnameField = view.getViewById(this.page, "last-name");
        fnameField.dismissSoftInput();
        lnameField.dismissSoftInput();
        let hasErrors = false;
        if(this.firstName === ''){
            this.firstNameError = true;
            hasErrors = true;
        }
        if(this.lastName === ''){
            this.lastNameError = true;
            hasErrors = true;
        }
        if(hasErrors){
            return;
        }else{
            this.isLoading = true;
            this.loginService.signUpParent(this.email,this.password,this.firstName,this.lastName, this.uploadedPicId)
                .subscribe(
                    (result) => {
                        this.isLoading = false;
                        let body = result.body;
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
                        alert(error.message);
                        //this.serverErrorService.showErrorModal();
                    }
                );

        }
    }


}