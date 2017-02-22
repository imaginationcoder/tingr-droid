import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {Page} from "ui/page";
import {ServerErrorService} from "../../services/server.error.service";

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
    providers: [],
    templateUrl: "./fill-profile.html",
    styleUrls: ["../authentication/authentication.css"]
})

export class FillProfileComponent implements OnInit {
    isLoading: Boolean = false;
    public firstName: string = '';
    public lastName: string = '';
    public firstNameError: Boolean = false;
    public lastNameError: Boolean = false;
    public selectedImages = [];
    public picUploaded: Boolean = false;

    constructor(private router: Router,
                private routerExtensions: RouterExtensions, private page: Page,
                private vcRef: ViewContainerRef) {

    }

    ngOnInit() {
        this.page.actionBarHidden = true;
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
            width: 500, height: 500, keepAspectRatio: false, saveToGallery: false
        };
        cameraModule.takePicture(options).then((imageAsset) => {
            let imageBase64Data =  imageAsset.toBase64String(enums.ImageFormat.jpeg);
            this.picUploaded = true;
            teacherProfilePicView.src = imageAsset;
            this.changePhoto(imageBase64Data);
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
                    .getImage({ maxWidth: 500, maxHeight: 500})
                    .then((imageSource) => {
                        let imageBase64Data = imageSource.toBase64String(enums.ImageFormat.jpeg);
                        this.picUploaded = true;
                        teacherProfilePicView.src = imageSource;
                        this.changePhoto(imageBase64Data);

                    }).catch((e) => {
                    //console.log("Error: " + e);
                    //console.log(e.stack);
                });
                GC();
            }).catch((e) => {
            //console.log(e);
        });

    }

    changePhoto(imageBase64Data){
        //TODO send the imageBase64 in background
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

        }
    }


}