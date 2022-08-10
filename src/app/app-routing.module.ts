import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },  
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [UnauthGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
    canActivate: [UnauthGuard]
  },
  {
    path: 'signup-confirm/:email',
    loadChildren: () => import('./pages/signup-confirm/signup-confirm.module').then( m => m.SignupConfirmPageModule),
    canActivate: [UnauthGuard]
  },
  {
    path: 'login-forgot',
    loadChildren: () => import('./pages/login-forgot/login-forgot.module').then( m => m.LoginForgotPageModule),
    canActivate: [UnauthGuard]
  },
  {
    path: 'password-reset/:email',
    loadChildren: () => import('./pages/password-reset/password-reset.module').then( m => m.PasswordResetPageModule),
    canActivate: [UnauthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'security-settings',
    loadChildren: () => import('./pages/security-settings/security-settings.module').then( m => m.SecuritySettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'studio',
    loadChildren: () => import('./pages/studio/studio.module').then( m => m.StudioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'library',
    loadChildren: () => import('./pages/library/library.module').then( m => m.LibraryPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
