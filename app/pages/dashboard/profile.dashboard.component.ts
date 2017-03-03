import {Component, ViewContainerRef, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {DrawerPage} from "../drawer.page";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions} from 'nativescript-angular/router';
import {Page} from "ui/page";
import * as appSettings from "application-settings"

import {ServerErrorService} from "../../services/server.error.service";
import {ParentService} from "../../services/parent_service";
import {TokenService} from "../../services/token.service";
import {ParentInfo} from "../../providers/data/parent_info";
import {SharedData} from "../../providers/data/shared_data";

import {PostService, Post, TaggedTo, Comment} from "../../services/post.service";
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {ModalPostComment} from "../../pages/dialogs/modal-post-comment";
import { SnackBar, SnackBarOptions } from "nativescript-snackbar";
import * as timerModule  from "timer";
import dialogs = require("ui/dialogs");
let app = require("application");
let view = require("ui/core/view");
let tnsfx = require('nativescript-effects');
let nstoasts = require("nativescript-toasts");
let PhotoViewer = require("nativescript-photoviewer");
let photoViewer = new PhotoViewer();
let snackbar = new SnackBar();
require( "nativescript-dom" );

@Component({
    moduleId: module.id,
    selector: 'profile-dashboard-page',
    templateUrl: './profile-dashboard.html',
    styleUrls: ["./dashboard.css", "../home/home.css"],
    providers: [PostService,ServerErrorService, ModalDialogService , ParentService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileDashboardComponent implements OnInit {
    public isLoading: Boolean = false;
    public profile: any;
    public isKidProfile: Boolean = true;
    public emptyNoteMessage: string;

    // Posts related
    public lastModified: string = '';
    public postCount: number = 0;
    public loadOnDemandFired: Boolean = false;
    public isLoadingMore: Boolean = false;
    public showLoadingIndicator: Boolean = false;
    public loadMoreText: string = 'load more';
    public posts: any;
    public textOnlyBgColors: Array<any>;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private router: Router, private route: ActivatedRoute,
                private modal: ModalDialogService,
                private sharedData: SharedData,
                private routerExtensions: RouterExtensions,
                private page: Page,
                private parentService: ParentService,
                private postService: PostService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        this.profile = this.sharedData.profile;
        this.isKidProfile = this.sharedData.isKidProfile;


        this.textOnlyBgColors = ['#C46D21','#BE1C2F', '#FF3869', '#4195FF',
            '#A52BFF','#1E6587', '#32C4FC', '#FF2717','#FF601D', '#82AF52'];

        this.emptyNoteMessage = 'capture your family in action. tag a few or all. share with your circle.';

        this.posts = [];
    }

    ngOnInit() {
        // show alert if no internet connection
        //this.page.actionBarHidden = true;
        this.isLoading = true;
        this.getAllPosts(false);  
    }


    goBack() {
        //this.routerExtensions.backToPreviousPage();
        this.routerExtensions.navigate(["/my-family"],
            {
                transition: {name: "slideRight"}
            });
    }

    openProfileDetails(profile){
        if(this.isKidProfile){
            this.sharedData.kid = profile;
            this.routerExtensions.navigate(["/kid-profile"],
                {
                    transition: {name: "slideLeft"}
                });
        }else{
            this.sharedData.parent = profile;
            this.routerExtensions.navigate(["/parent-profile"],
                {
                    transition: {name: "slideLeft"}
                });
        }
    }


    openSchoolsData(profile){
        this.sharedData.profile = profile;
        this.routerExtensions.navigate(["/kid-schools"],
            {
                transition: {name: "slideLeft"}
            });
    }

// POST related stuff ----------------------------------------------------
    getAllPosts(loadingMorePosts) {
        this.postService.getAllPosts(this.postCount, this.lastModified, this.profile.kl_id)
            .subscribe(
                (result) => {
                    let body = result.body;
                    //console.log("Success "+ JSON.stringify(body));
                    body.posts.forEach(post => {
                        this.posts.push(this.addNewPostToListView(post));
                    });
                    this.postCount = body.post_count;
                    this.lastModified = body.last_modified;
                    if (loadingMorePosts) {
                        this.showLoadingIndicator = false;
                        this.loadMoreText = 'load more';
                        if (body.posts.length < 1) {
                            this.isLoadingMore = false;
                            /* nstoasts.show({
                             text: 'reached end of results',
                             duration: nstoasts.DURATION.SHORT
                             });*/
                        }
                    } else {
                        this.isLoadingMore = true;
                        if(body.posts.length < 1) {
                            this.isLoadingMore = false;
                        }
                    }
                    this.isLoading = false;
                    this.changeDetectorRef.markForCheck();
                },
                (error) => { 
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    loadMoreOrgPosts() {
        this.isLoadingMore = true;
        this.showLoadingIndicator = true;
        this.loadMoreText = 'loading...';
        this.getAllPosts(true);
    }


    addNewPostToListView(post) {
        let newPost = new Post(post.kl_id, post.slug, post.title, post.new_title, post.tzone,
            post.scope, post.text, post.author_name, post.photograph,
            post.new_created_at, post.deletable,
            post.can_delete, post.can_edit, post.can_save, post.kid_birthdate,
            post.hearted, post.heart_icon, post.hearts_count, post.asset_base_url);
        // tags
        newPost.tags = post.tags;
        newPost.images = post.images;
        newPost.large_images = post.large_images;
        newPost.img_keys = post.img_keys;
        let isTextOnly = post.images[0] ? false : true;
        newPost.text_only =  isTextOnly;
        if(isTextOnly){
            newPost.text_only_bg = this.textOnlyBgColors[Math.floor((Math.random()*this.textOnlyBgColors.length))]
        }
        // add comments
        if (post.comments.length) {
            post.comments.forEach((comment) => {
                newPost.comments.push(new Comment(comment.commented_by, comment.slug, comment.created_at, comment.child_name,
                    comment.child_relationship, comment.commenter_photo, comment.content, comment.unknown_commenter))
            })
        } else {
            newPost.comments = []
        }
        // add tagged_to
        if (post.tagged_to.length) {
            post.tagged_to.forEach((tagged) => {
                newPost.tagged_to.push(new TaggedTo(tagged.kl_id, tagged.short_name, tagged.nickname,
                    tagged.photograph, tagged.fname, tagged.lname))
            })
        } else {
            newPost.tagged_to = [];
        }

        return newPost;
    } 

    addOrRemoveHeart(post, index) {
        let currentPostObject = this.posts[index];
        let isHearted = currentPostObject.hearted;
        if (isHearted) {
            //already hearted so unheart it
            currentPostObject.hearted = false;
            currentPostObject.hearts_count--;
        } else {
            currentPostObject.hearted = true; //heart it

        }
        this.postService.addOrRemoveHeart(post, isHearted)
            .subscribe(
                (result) => {
                    let body = result.body;
                    // update currentPost with new data
                    currentPostObject.asset_base_url = body.asset_base_url;
                    currentPostObject.heart_icon = body.heart_icon;
                    currentPostObject.hearts_count = body.hearts_count;
                    nstoasts.show({
                        text: result.message,
                        duration: nstoasts.DURATION.SHORT
                    });
                    this.changeDetectorRef.markForCheck();
                },
                (error) => {
                }
            );
    }

    // edit , delete post etc..
    selectPostActions(args, post, index) {
        let actions = [];

        if (post.can_edit) {
            //TODO enable after completing the editPostSection
           // actions.push('Edit')
        }
        if (post.can_delete) {
            actions.push('Delete')
        }
        if (actions.length) {
            dialogs.action({
                //message: "",
                cancelButtonText: "Cancel",
                actions: actions
            }).then(result => {
                if (result === 'Delete') {
                    this.deletePost(post, index);
                } else if (result === 'Edit') {
                    this.editPost(post);
                }
            });
        }

    }

    editPost(post) {
        // save the post data in providers to available in next screen
        this.sharedData.currentPost = post;
        this.routerExtensions.navigate(["/edit-moment"], {
            transition: {
                name: "slideLeft",
                duration: 300,
                curve: "easeInOut"
            }
        });
    }

    deletePost(post, index) {
        let postIndex = this.posts.indexOf(post);
        this.posts.splice(postIndex, 1);
        snackbar.simple('Post successfully deleted.')
        this.changeDetectorRef.markForCheck();
        this.postService.deletePost(post)
            .subscribe(
                (result) => {
                },
                (error) => {
                }
            );
    }

    showPostLikes(post) {
        // assign post kl_id to sharedData to available in next screen
        this.sharedData.postKlId = post.kl_id;
        this.routerExtensions.navigate(["/post-likes"], {
            transition: {
                name: "slideLeft",
                duration: 300,
                curve: "easeInOut"
            }
        });
    }

    openPostImages(post) {
        // Add to array and pass to showViewer
        // add multiple images if post has
        let postImages = post.large_images;
        //postImages.push(post.large_images);
        photoViewer.showViewer(postImages);
    }

    showModalCommentToPost(post, index) {
        var options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                post_kl_id: post.kl_id,
                post_slug: post.slug
            },
            fullscreen: false
        };
        // let currentPost = this.posts.getItem(index);
        let currentPost = post;
        if (currentPost) {
            this.modal.showModal(ModalPostComment, options).then((result) => {
                if (result === 'close' || typeof(result) == "undefined") {
                    // modal closed
                } else {
                    //TODO append commet detail to currentPost Object as Observable instead refreshing..
                    //console.log("Modal Comment Result " + JSON.stringify(result));/
                    currentPost.comments.push(new Comment(result.commented_by, result.slug, result.created_at, '',
                        '', result.commenter_photo, result.content, false));
                    snackbar.simple("Your comment added.");
                    this.changeDetectorRef.markForCheck();
                }
            })
        }
    }


}