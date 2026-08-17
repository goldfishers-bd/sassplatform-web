import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';
import { RoutePaths } from '../../../core/constants/route-paths';
import { extractErrorMessage } from '@/app/core/utils/error-utils';

@Component({
    selector: 'app-accept-invite',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
    templateUrl: './accept-invite.component.html',
})
export class AcceptInviteComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    loading = signal(false);
    errorMessage = signal<string | null>(null);
    tokenMissing = signal(false);
    private token = '';

    form = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
    });

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
        if (!this.token) this.tokenMissing.set(true);
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const { password, confirmPassword } = this.form.getRawValue();
        if (password !== confirmPassword) {
            this.errorMessage.set('Passwords do not match.');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        this.authService.acceptInvite({ token: this.token, password: password! }).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate([RoutePaths.dashboard]);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(extractErrorMessage(err, 'Invitation is invalid or expired.'));
            }
        });
    }
}