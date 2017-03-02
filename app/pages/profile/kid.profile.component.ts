import {Component, ViewContainerRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";

import {ServerErrorService} from "../../services/server.error.service";
import {SharedData} from "../../providers/data/shared_data";
import {ParentService} from "../../services/parent_service";
import { SnackBar, SnackBarOptions } from "nativescript-snackbar";

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
    selector: 'kid-profile',
    styleUrls: ['./kid-profile.css'],
    templateUrl: './kid-profile.html',
    providers: [ParentService, ServerErrorService]
})
export class KidProfileComponent implements OnInit {
    public kid:any;
    public isLoading:Boolean = false;
    public selectedImages = [];
    public picUploaded: Boolean = false;

    constructor(private page:Page, private changeDetectorRef:ChangeDetectorRef,
                private router:Router,
                private routerExtensions:RouterExtensions,
                private parentService: ParentService,
                private sharedData:SharedData,
                private vcRef:ViewContainerRef,
                private serverErrorService:ServerErrorService) {
        //super(changeDetectorRef);
        this.kid = this.sharedData.kid;

    }

    ngOnInit() {
        // show alert if no internet connection
        this.refreshKidDetails();
    }
    
    refreshKidDetails(){
        this.parentService.getKiProfileDetails(this.kid.kl_id)
            .subscribe(
                (result) => { 
                    this.kid = result.body;
                    // set kl_id , photograph again because this response differ from sharedData.kid
                    this.kid.kl_id = result.body.kid_klid;
                    this.kid.photograph = result.body.photograph_url;
                },
                (error) => { 
                    //this.serverErrorService.showErrorModal();
                }
            );
    }

    goBack() {
        if(this.picUploaded){
            this.sharedData.profile = this.kid;
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
        let kidProfilePicView = view.getViewById(this.page, 'kidProfilePic');
        let options = {
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
        let kidProfilePicView = view.getViewById(this.page, 'kidProfilePic');

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

        let profile_id = this.kid.kl_id;
        let kidProfilePicView = view.getViewById(this.page, 'kidProfilePic');
        this.isLoading = true;
        this.parentService.changePhotograph(imageBase64Data,profile_id)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.sharedData.profile['photograph'] = body.thumb_photograph;
                    this.kid.photograph = body.thumb_photograph;
                    kidProfilePicView.src = body.thumb_photograph;
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
    
    

}