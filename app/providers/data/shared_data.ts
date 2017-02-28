// from the ref: https://www.thepolyglotdeveloper.com/2016/10/passing-complex-data-angular-2-router-nativescript/

import { Injectable } from '@angular/core';

@Injectable()
export class SharedData {

    public email: string;
    public afterEmailNavigateTo: string;
    public password: string;
    public orgTourUrl: string;
    // to carry posKlId to next screen like hearters ,commenting on post etc..
    public postKlId: string;
    // to edit current post
    public currentPost: any;

    public organizationId: string;
    public schoolUrl: string;
    public schoolLinkName: string;
    public organizationName: string;
    public conversationId: string;
    
    public kid: any;
    public parent: any;

    public constructor() { }

}