import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InvitationService } from '../../core/services/invitation.service';
import { Invitation } from '../../core/models/invitation.models';
import { Roles } from '../../core/constants/roles';

@Component({
    selector: 'app-invitations',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TagModule, ToastModule],
    providers: [MessageService],
    templateUrl: './invitations.component.html',
})
export class InvitationsComponent implements OnInit {
    private invitationService = inject(InvitationService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);

    invitations = signal<Invitation[]>([]);
    loading = signal(false);
    dialogVisible = signal(false);
    sending = signal(false);

    roleOptions = [
        { label: 'Member', value: Roles.Member },
        { label: 'Tenant Admin', value: Roles.TenantAdmin }
    ];

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        role: [Roles.Member, Validators.required]
    });

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.invitationService.getPending().subscribe({
            next: (data) => { this.invitations.set(data); this.loading.set(false); },
            error: () => { this.loading.set(false); this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load invitations' }); }
        });
    }

    openInvite(): void {
        this.form.reset({ email: '', role: Roles.Member });
        this.dialogVisible.set(true);
    }

    send(): void {
        if (this.form.invalid) return;
        this.sending.set(true);
        const value = this.form.getRawValue();

        this.invitationService.invite({ email: value.email!, role: value.role! }).subscribe({
            next: () => {
                this.sending.set(false);
                this.dialogVisible.set(false);
                this.messageService.add({ severity: 'success', summary: 'Sent', detail: `Invitation sent to ${value.email}` });
                this.load();
            },
            error: (err) => {
                this.sending.set(false);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.title ?? 'Failed to send invitation' });
            }
        });
    }

    statusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
        switch (status) {
            case 'Accepted': return 'success';
            case 'Pending': return 'info';
            case 'Expired': return 'warn';
            default: return 'danger';
        }
    }
}