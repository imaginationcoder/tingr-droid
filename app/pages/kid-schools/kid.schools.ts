import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {RouterExtensions} from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
import {TokenService} from "../../services/token.service";
import {ParentInfo} from "../../providers/data/parent_info";
import {ParentService} from "../../services/parent_service";
import {KidService} from "../../services/kid.service";
import {ServerErrorService} from "../../services/server.error.service";
import {ConversationService} from "../../services/conversation.service";
import {SharedData} from "../../providers/data/shared_data";
import dialogs = require("ui/dialogs");
let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'my-family-page',
    templateUrl: './kid-schools.html',
    styleUrls: ["./kid-schools.css"],
    providers: [ConversationService, KidService, ParentService, ServerErrorService]
})
export class KidSchoolsComponent implements OnInit {
    public isLoading:Boolean = false;
    public schools: Array<any>;
    public schoolsNames: Array<any>;
    public formsAndDocs: Array<any>;
    public kid: any;
    public currentSchoolName: string;
    public moreThanOneSchool: Boolean = false;

    constructor(private routerExtensions:RouterExtensions,
                private parentService:ParentService,
                private kidService: KidService,
                private conversationService:ConversationService,
                private vcRef:ViewContainerRef,
                private sharedData:SharedData,
                private serverErrorService:ServerErrorService,
                private router:Router) {

        this.kid = this.sharedData.kid;
        this.schools = [];
        this.schoolsNames = [];
        this.formsAndDocs = [];
    }

    ngOnInit() {
        // show alert if no internet connection
        this.getSchoolsData();
    }



    getSchoolsData() {
        this.isLoading = true;
        this.kidService.getSchoolsData(this.kid.kl_id)
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    var body = result.body; 
                    body.organizations.forEach(school => { 
                        this.schoolsNames.push(school.name);
                    });
                    
                    this.schools = body.organizations; 
                    //console.log(JSON.stringify(this.schools));  
                    let currentSchoolObj = this.schools[0];

                    if(this.schoolsNames.length > 1){
                        this.moreThanOneSchool = true;
                    }
                    if(currentSchoolObj){
                        this.currentSchoolName = currentSchoolObj.name;
                        this.formsAndDocs = currentSchoolObj.forms_and_documents;
                    } 
                },
                (error) => {
                    this.isLoading = false;

                    console.log("error " + JSON.stringify(error));
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.kidService.getSchoolsData(this.kid.kl_id)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.schools = body.organizations;
                    this.isLoading = false;
                    this.schoolsNames = [];
                    body.organizations.forEach(school => {
                        this.schoolsNames.push(school.name);
                    });

                    this.schools = body.organizations;

                    let currentSchoolObj = body.organizations.filter(report => report.name === this.currentSchoolName)[0] || this.schools[0];



                    if(this.schoolsNames.length > 1){
                        this.moreThanOneSchool = true;
                    }
                    if(currentSchoolObj){
                        this.currentSchoolName = currentSchoolObj.name;
                        this.formsAndDocs = currentSchoolObj.forms_and_documents;
                    }
                    setTimeout(() => {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    this.serverErrorService.showErrorModal();
                }
            );

    }


    changeSchool(){
        if(this.moreThanOneSchool){
            let schoolNames = this.schoolsNames;
            let actions = [];
            for (let school of schoolNames) {
                actions.push(school);
            }
            dialogs.action({
                message: "Select School",
                cancelButtonText: "Cancel",
                actions: actions
            }).then(result => {
                if (result !== 'Cancel') {
                    // don't fetch data if clicks on same room
                    if (this.currentSchoolName != result) {
                        let currentSchoolObj = this.schools.filter(report => report.name === result)[0];
                        if(currentSchoolObj){
                            this.currentSchoolName = currentSchoolObj.name;
                            this.formsAndDocs = currentSchoolObj.forms_and_documents;
                        }
                    }
                }
            });
        }else{
            return
        }
    }


    onItemTap(args){
       this.sharedData.formOrDoc = this.formsAndDocs[args.index];
        this.routerExtensions.navigate(["/form-doc-webview"],
            {
                transition: {name: "slideLeft"}
            });

    }


    goBack() {
        this.routerExtensions.backToPreviousPage();
    }
}