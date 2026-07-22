import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';
import { RoutePaths } from '../../../core/constants/route-paths';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
    templateUrl: './signup.component.html'
})
export class SignupComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loading = signal(false);
    errorMessage = signal<string | null>(null);

    form = this.fb.group({
        tenantName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    constructor() { }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.loading.set(true);
        this.errorMessage.set(null);

        this.authService.signup(this.form.getRawValue() as { tenantName: string; email: string; password: string }).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate([RoutePaths.dashboard]);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(err.error?.errors ? 'Please fix the highlighted errors.' : (err.error?.title ?? 'Signup failed.'));
            }
        });
    }
}