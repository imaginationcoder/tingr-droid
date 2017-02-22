// from the ref: https://www.thepolyglotdeveloper.com/2016/10/passing-complex-data-angular-2-router-nativescript/

import { Injectable } from '@angular/core';

@Injectable()
export class SharedData {

    public email: string;
    public afterEmailNavigateTo: string;
    public password: string;
    public confirmPassword: string;
    public orgTourUrl: string;
    public constructor() { }

}