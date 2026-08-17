import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../core/models/profile.models';
import { extractErrorMessage } from '@/app/core/utils/error-utils';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule, ToastModule],
    providers: [MessageService],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    private profileService = inject(ProfileService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);

    profile = signal<Profile | null>(null);
    loading = signal(false);
    savingProfile = signal(false);
    changingPassword = signal(false);
    passwordError = signal<string | null>(null);

    profileForm = this.fb.group({
        displayName: ['', Validators.required]
    });

    passwordForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
    });

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.profileService.get().subscribe({
            next: (data) => {
                this.profile.set(data);
                this.profileForm.patchValue({ displayName: data.displayName });
                this.loading.set(false);
            },
            error: () => { this.loading.set(false); this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load profile' }); }
        });
    }

    saveProfile(): void {
        if (this.profileForm.invalid) return;
        this.savingProfile.set(true);

        this.profileService.update({ displayName: this.profileForm.getRawValue().displayName! }).subscribe({
            next: () => {
                this.savingProfile.set(false);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated' });
                this.load();
            },
            error: (err) => {
                this.savingProfile.set(false);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: extractErrorMessage(err, 'Update failed') });
            }
        });
    }

    changePassword(): void {
        if (this.passwordForm.invalid) return;

        const { currentPassword, newPassword, confirmPassword } = this.passwordForm.getRawValue();
        if (newPassword !== confirmPassword) {
            this.passwordError.set('New passwords do not match.');
            return;
        }

        this.changingPassword.set(true);
        this.passwordError.set(null);

        this.profileService.changePassword({ currentPassword: currentPassword!, newPassword: newPassword! }).subscribe({
            next: () => {
                this.changingPassword.set(false);
                this.passwordForm.reset();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password changed' });
            },
            error: (err) => {
                this.changingPassword.set(false);
                this.passwordError.set(extractErrorMessage(err, 'Failed to change password'));
            }
        });
    }
}