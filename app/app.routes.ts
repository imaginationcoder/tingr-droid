import { AuthGuard } from "./auth-guard.service";
import { VerifyEmailComponent } from "./pages/authentication/verify-email.component";
import { VerifyPasswordComponent } from "./pages/authentication/verify-password.component";
import { ForgotPasswordComponent } from "./pages/authentication/forgot-password.component";
import { ChoosePasswordComponent } from "./pages/authentication/choose-password.component";
import { VerifyCodeComponent } from "./pages/authentication/verify-code.component";
import { FillProfileComponent } from "./pages/my-profile/fill-profile.component";
import { TourComponent } from "./pages/tour/tour.component";
import { OrgTourComponent } from "./pages/tour/org-tour.component";
import { HomeComponent } from "./pages/home/home.component";
import { ModalServerError } from "./pages/dialogs/modal-server-error";

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
    { path: "home", component: HomeComponent, canActivate: [AuthGuard]}
];

export const navigatableComponents = [
    VerifyEmailComponent,
    VerifyPasswordComponent,
    ForgotPasswordComponent,
    ChoosePasswordComponent,
    VerifyCodeComponent,
    FillProfileComponent,
    TourComponent,
    OrgTourComponent,
    HomeComponent,
    ModalServerError
];

export const authProviders = [
    AuthGuard
];
