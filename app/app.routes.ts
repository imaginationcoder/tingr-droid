import { AuthGuard } from "./auth-guard.service";
import { DrawerComponent } from "./components/drawer/drawer.component";
import { VerifyEmailComponent } from "./pages/authentication/verify-email.component";
import { VerifyPasswordComponent } from "./pages/authentication/verify-password.component";
import { ForgotPasswordComponent } from "./pages/authentication/forgot-password.component";
import { ChoosePasswordComponent } from "./pages/authentication/choose-password.component";
import { VerifyCodeComponent } from "./pages/authentication/verify-code.component";
import { FillProfileComponent } from "./pages/my-profile/fill-profile.component";
import { TourComponent } from "./pages/tour/tour.component";
import { OrgTourComponent } from "./pages/tour/org-tour.component";
import { HomeComponent } from "./pages/home/home.component";
import { LikesComponent } from "./pages/posts/likes.component";
import { SettingsComponent } from "./pages/settings/settings.page";
import { ConversationsComponent } from "./pages/conversations/conversations.component";
import { MessagesComponent } from "./pages/conversations/messages.component";
import { SchoolInfoComponent } from "./pages/school/school-info.component";
import { SchoolInfoWebComponent } from "./pages/school/school-info-web.component";
import { MyFamilyComponent } from "./pages/my-family/my-family.component"; 
import { KidSchoolsComponent } from "./pages/kid-schools/kid.schools";
import { KidProfileComponent } from "./pages/profile/kid.profile.component";
import { ParentProfileComponent } from "./pages/profile/parent.profile.component";
import { ProfileDashboardComponent } from "./pages/dashboard/profile.dashboard.component";
import { FormDocWebviewComponent } from "./pages/form-docs/form.doc.webview";
import { ModalServerError } from "./pages/dialogs/modal-server-error";
import { ModalPostComment } from "./pages/dialogs/modal-post-comment";
import { ModalEditProfile } from "./pages/dialogs/modal-edit-profile";

export const APP_ROUTES = [
    { path: "", redirectTo: "/home", pathMatch: 'full'},
    { path: "verify-email", component: VerifyEmailComponent},
    { path: "verify-password", component: VerifyPasswordComponent},
    { path: "forgot-password", component: ForgotPasswordComponent},
    { path: "choose-password", component: ChoosePasswordComponent},
    { path: "verify-code", component: VerifyCodeComponent},
    { path: "fill-profile", component: FillProfileComponent},
    { path: "tour", component: TourComponent, canActivate: [AuthGuard]},
    { path: "org-tour", component: OrgTourComponent, canActivate: [AuthGuard]},
    { path: "home", component: HomeComponent, canActivate: [AuthGuard]},
    { path: "settings", component: SettingsComponent, canActivate: [AuthGuard]},
    { path: "post-likes", component: LikesComponent, canActivate: [AuthGuard]},
    { path: "conversations", component: ConversationsComponent, canActivate: [AuthGuard]},
    { path: "messages", component: MessagesComponent, canActivate: [AuthGuard]},
    { path: "school-info", component: SchoolInfoComponent, canActivate: [AuthGuard]},
    { path: "school-webview", component: SchoolInfoWebComponent, canActivate: [AuthGuard]},
    { path: "my-family", component: MyFamilyComponent, canActivate: [AuthGuard]}, 
    { path: "kid-schools", component: KidSchoolsComponent, canActivate: [AuthGuard]},
    { path: "kid-profile", component: KidProfileComponent, canActivate: [AuthGuard]},
    { path: "parent-profile", component: ParentProfileComponent, canActivate: [AuthGuard]},
    { path: "profile-dashboard", component: ProfileDashboardComponent, canActivate: [AuthGuard]},
    { path: "form-doc-webview", component: FormDocWebviewComponent, canActivate: [AuthGuard]}
];


export const navigatableComponents = [
    DrawerComponent,
    VerifyEmailComponent,
    VerifyPasswordComponent,
    ForgotPasswordComponent,
    ChoosePasswordComponent,
    VerifyCodeComponent,
    FillProfileComponent,
    TourComponent,
    OrgTourComponent,
    HomeComponent,
    LikesComponent,
    SettingsComponent,
    ConversationsComponent,
    SchoolInfoComponent,
    SchoolInfoWebComponent,
    MyFamilyComponent,
    MessagesComponent, 
    KidSchoolsComponent,
    KidProfileComponent,
    ParentProfileComponent,
    ProfileDashboardComponent,
    FormDocWebviewComponent,
    ModalServerError,
    ModalPostComment,
    ModalEditProfile
];

export const authProviders = [
    AuthGuard
];
