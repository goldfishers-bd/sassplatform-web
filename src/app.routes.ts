import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Roles } from './app/core/constants/roles';
import { roleGuard } from './app/core/guards/role.guard';
import { authGuard } from './app/core/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        children: [
            { path: 'login', loadComponent: () => import('./app/pages/auth/login/login.component').then(m => m.LoginComponent) },
            { path: 'signup', loadComponent: () => import('./app/pages/auth/signup/signup.component').then(m => m.SignupComponent) },
            { path: 'accept-invite', loadComponent: () => import('./app/pages/auth/accept-invite/accept-invite.component').then(m => m.AcceptInviteComponent) }
        ]
    },
    //{ path: 'plans/manage', canActivate: [authGuard, roleGuard(Roles.SuperAdmin)], component: PlanManageComponent },
    { path: '**', redirectTo: '/notfound' }
];
