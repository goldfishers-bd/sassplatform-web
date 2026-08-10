import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, MessageModule],
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    loading = signal(false);
    submitted = signal(false);

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    onSubmit(): void {
        if (this.form.invalid) return;
        this.loading.set(true);

        this.authService.forgotPassword({ email: this.form.getRawValue().email! }).subscribe({
            next: () => { this.loading.set(false); this.submitted.set(true); },
            error: () => { this.loading.set(false); this.submitted.set(true); } // same UX either way — no enumeration
        });
    }
}