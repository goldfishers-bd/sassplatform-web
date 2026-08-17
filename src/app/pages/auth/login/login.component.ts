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
import { extractErrorMessage } from '@/app/core/utils/error-utils';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loading = signal(false);
    errorMessage = signal<string | null>(null);

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    constructor() { }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.loading.set(true);
        this.errorMessage.set(null);

        this.authService.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate([RoutePaths.dashboard]);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(extractErrorMessage(err, 'Login failed. Check your credentials.'));
            }
        });
    }
}