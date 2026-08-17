import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';
import { Roles } from '../core/constants/roles';

export default [
    { path: 'tenants', canActivate: [authGuard, roleGuard(Roles.SuperAdmin)], loadComponent: () => import('./tenants/tenants.component').then(m => m.TenantsComponent) },
    { path: 'plans', canActivate: [authGuard, roleGuard(Roles.SuperAdmin)], loadComponent: () => import('./plans/plans.component').then(m => m.PlansComponent) },
    { path: 'invitations', canActivate: [authGuard, roleGuard(Roles.TenantAdmin)], loadComponent: () => import('./invitations/invitations.component').then(m => m.InvitationsComponent) },
    { path: 'billing', canActivate: [authGuard, roleGuard(Roles.TenantAdmin)], loadComponent: () => import('./billing/billing.component').then(m => m.BillingComponent) },
    { path: 'users', canActivate: [authGuard, roleGuard(Roles.TenantAdmin)], loadComponent: () => import('./users/users.component').then(m => m.UsersComponent) },
    { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;