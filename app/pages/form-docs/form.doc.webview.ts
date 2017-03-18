import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import { RouterExtensions } from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
 
import { ServerErrorService } from "../../services/server.error.service";
import { SharedData } from "../../providers/data/shared_data";

let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'form-doc-page',
    templateUrl: './form-doc-webview.html', 
    providers: [ ServerErrorService ]
})
export class FormDocWebviewComponent implements OnInit{
    public isLoading: Boolean = false;
    public formOrDoc: any;
    public isPdfView: Boolean = false;

    constructor(private sharedData: SharedData,
                private routerExtensions: RouterExtensions, 
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService,
                private router: Router) {
        this.formOrDoc = this.sharedData.formOrDoc;
    }

    ngOnInit(){
        // show alert if no internet connection

        let extension = this.formOrDoc.url.split('.').pop();
        if(this.formOrDoc.type === 'Document' && extension === 'pdf') {
            this.isPdfView = true;
        }

    }

    goBack(){
       this.routerExtensions.backToPreviousPage(); 
    }

    
}
