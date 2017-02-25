import { AuthGuard } from "./auth-guard.service";
import {DrawerComponent} from "./components/drawer/drawer.component";
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
import { ModalServerError } from "./pages/dialogs/modal-server-error";
import { ModalPostComment } from "./pages/dialogs/modal-post-comment";

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
    { path: "messages", component: MessagesComponent, canActivate: [AuthGuard]}
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
    MessagesComponent,
    ModalServerError,
    ModalPostComment
];

export const authProviders = [
    AuthGuard
];
