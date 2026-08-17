import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../../core/services/user.service';
import { TenantUser } from '../../core/models/user.models';
import { AuthService } from '@/app/core/services/auth.service';
import { extractErrorMessage } from '@/app/core/utils/error-utils';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private authService = inject(AuthService);

    users = signal<TenantUser[]>([]);
    loading = signal(false);
    currentUserId = this.authService.getDecodedToken()?.sub ?? '';

    isSelf(user: TenantUser): boolean {
        return user.id === this.currentUserId;
    }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.userService.getAll().subscribe({
            next: (data) => { this.users.set(data); this.loading.set(false); },
            error: () => { this.loading.set(false); this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' }); }
        });
    }

    confirmToggle(user: TenantUser): void {
        const action = user.isActive ? 'deactivate' : 'reactivate';
        this.confirmationService.confirm({
            message: `${user.isActive ? 'Deactivate' : 'Reactivate'} ${user.email}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.toggle(user, action)
        });
    }

    private toggle(user: TenantUser, action: 'deactivate' | 'reactivate'): void {
        const request = action === 'deactivate' ? this.userService.deactivate(user.id) : this.userService.reactivate(user.id);

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${action}d` });
                this.load();
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: extractErrorMessage(err, `Failed to ${action}`) });
            }
        });
    }
}