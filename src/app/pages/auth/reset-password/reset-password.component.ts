import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';
import { RoutePaths } from '../../../core/constants/route-paths';
import { extractErrorMessage } from '@/app/core/utils/error-utils';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, PasswordModule, ButtonModule, MessageModule],
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    loading = signal(false);
    errorMessage = signal<string | null>(null);
    linkInvalid = signal(false);
    private email = '';
    private token = '';

    form = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
    });

    ngOnInit(): void {
        this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
        if (!this.email || !this.token) this.linkInvalid.set(true);
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const { newPassword, confirmPassword } = this.form.getRawValue();
        if (newPassword !== confirmPassword) {
            this.errorMessage.set('Passwords do not match.');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        this.authService.resetPassword({ email: this.email, token: this.token, newPassword: newPassword! }).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate([RoutePaths.login]);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(extractErrorMessage(err, 'Reset link is invalid or expired.'));
            }
        });
    }
}