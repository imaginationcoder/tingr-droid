import {Component, ViewContainerRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";

import {ServerErrorService} from "../../services/server.error.service";
import {SharedData} from "../../providers/data/shared_data";
import {ParentService} from "../../services/parent_service";
import { SnackBar, SnackBarOptions } from "nativescript-snackbar";
import { ParentInfo } from "../../providers/data/parent_info";

import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import { ModalEditProfile } from "../../pages/dialogs/modal-edit-profile";

let platformModule = require("platform");
let permissions = require("nativescript-permissions");
let cameraModule = require("camera");
import {GC} from 'utils/utils';
let enums = require("ui/enums");
let imagepicker = require("nativescript-imagepicker");
import dialogs = require("ui/dialogs");
let view = require("ui/core/view");
let nstoasts = require("nativescript-toasts");
let app = require("application");
declare var android: any;
@Component({
    moduleId: module.id,
    selector: 'parent-profile',
    styleUrls: ['./parent-profile.css'],
    templateUrl: './parent-profile.html',
    providers: [ParentService, ModalDialogService, ServerErrorService]
})
export class ParentProfileComponent implements OnInit {
    public parent: any;
    public isLoading:Boolean = false;
    public selectedImages = [];
    public picUploaded: Boolean = false;
    public isCurrentUserProfile: Boolean = false;

    constructor(private page:Page, private changeDetectorRef:ChangeDetectorRef,
                private router:Router,
                private routerExtensions:RouterExtensions,
                private modal: ModalDialogService,
                private parentService: ParentService,
                private sharedData:SharedData,
                private vcRef:ViewContainerRef,
                private serverErrorService:ServerErrorService) {
        //super(changeDetectorRef);
        this.parent = this.sharedData.parent;
        let parentInfo = ParentInfo.parsedDetails.profile; 

        if(this.parent.email === parentInfo.email){
            this.isCurrentUserProfile = true;
        }

    }

    ngOnInit() {
        // show alert if no internet connection
    }

    goBack() {
        if(this.picUploaded){
            this.sharedData.profile = this.parent;
            this.routerExtensions.navigate(["/profile-dashboard"],
                {
                    transition: {name: "slideRight"}
                });
        }else{
            this.routerExtensions.backToPreviousPage();
        }

    }

    //change phottograph related
    selectChangePhotoOption() {
        dialogs.action({
            //message: "",
            cancelButtonText: "Cancel",
            actions: ["Take photo", "Choose existing"]
        }).then(result => {
            if (result === 'Take photo') {
                if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
                    permissions.requestPermission(android.Manifest.permission.CAMERA, "Allow Tingr to access your camera?")
                        .then(() => {
                            //console.log("CAMERA Permission: granted!");
                            this.takePicture();
                        })
                        .catch(() => {
                            //console.log("CAMERA Permission: -- refused");
                        });
                }  else{
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
                } else{
                    this.selectFromGallery();
                }
            }
        });
    }


    takePicture() {
        let kidProfilePicView = view.getViewById(this.page, 'parentProfilePic');
        let options = {
            width: 400, height: 400, keepAspectRatio: true,
            saveToGallery: false
        };
        cameraModule.takePicture(options).then((imageAsset) => {
            let imageBase64Data =  imageAsset.toBase64String(enums.ImageFormat.jpeg);
            this.picUploaded = true;
            //kidProfilePicView.src = imageAsset;
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
        let kidProfilePicView = view.getViewById(this.page, 'parentProfilePic');

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
                        //kidProfilePicView.src = imageSource;
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

        let profile_id = this.parent.kl_id;
        let parentProfilePicView = view.getViewById(this.page, 'parentProfilePic');
        this.isLoading = true;
        this.parentService.changePhotograph(imageBase64Data,profile_id)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.sharedData.profile['photograph'] = body.thumb_photograph;
                    this.parent.photograph = body.thumb_photograph;
                    parentProfilePicView.src = body.thumb_photograph;
                    this.isLoading = false;
                    let snackbar = new SnackBar();
                    snackbar.simple('Photograph changed successfully.');
                },
                (error) => {
                    this.isLoading = false;
                    //console.log("error "+ JSON.stringify(error));
                    this.serverErrorService.showErrorModal();
                }
            );
    }


    openEditModal() { 
        var options:ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                parent_klid: this.parent.kl_id,
                fname: this.parent.fname,
                lname: this.parent.lname
            },
            fullscreen: false
        };
        this.modal.showModal(ModalEditProfile, options).then((result) => {
            if (result === 'close' || typeof(result) == "undefined") {
                // modal closed
            } else {
                this.parent.fname = result.fname;
                this.parent.lname = result.lname;
                nstoasts.show({
                    text: 'Profile updated',
                    duration: nstoasts.DURATION.SHORT
                });
                // invoke api in background to update
                this.updateProfile(result);
            }
        })
    }

    updateProfile(data) {
        let parent_klid = this.parent.kl_id;
        this.parentService.updateProfile(data, parent_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.parent = body.profile; 
                     // update parent info in app settings
                     ParentInfo.details = JSON.stringify(body);
                },
                (error) => { 
                    //console.log("error "+ JSON.stringify(error));
                }
            );
    }



}