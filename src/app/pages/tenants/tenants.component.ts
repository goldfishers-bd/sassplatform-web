import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TenantService } from '../../core/services/tenant.service';
import { Tenant } from '../../core/models/tenant.models';
import { extractErrorMessage } from '@/app/core/utils/error-utils';

@Component({
    selector: 'app-tenants',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToggleSwitchModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './tenants.component.html'
})
export class TenantsComponent implements OnInit {
    private tenantService = inject(TenantService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    tenants = signal<Tenant[]>([]);
    loading = signal(false);
    dialogVisible = signal(false);
    isEditMode = signal(false);
    saving = signal(false);

    form = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        isActive: [true]
    });

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.tenantService.getAll().subscribe({
            next: (data) => { this.tenants.set(data); this.loading.set(false); },
            error: () => { this.loading.set(false); this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load tenants' }); }
        });
    }

    openCreate(): void {
        this.isEditMode.set(false);
        this.form.reset({ id: '', name: '', isActive: true });
        this.dialogVisible.set(true);
    }

    openEdit(tenant: Tenant): void {
        this.isEditMode.set(true);
        this.form.reset({ id: tenant.id, name: tenant.name, isActive: tenant.isActive });
        this.dialogVisible.set(true);
    }

    save(): void {
        if (this.form.invalid) return;
        this.saving.set(true);
        const value = this.form.getRawValue();

        const onSuccess = () => {
            this.saving.set(false);
            this.dialogVisible.set(false);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `Tenant ${this.isEditMode() ? 'updated' : 'created'}` });
            this.load();
        };

        const onError = (err: any) => {
            this.saving.set(false);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: extractErrorMessage(err, 'Save failed') });
        };

        if (this.isEditMode()) {
            this.tenantService.update({ id: value.id!, name: value.name!, isActive: value.isActive! })
                .subscribe({ next: onSuccess, error: onError });
        } else {
            this.tenantService.create({ name: value.name! })
                .subscribe({ next: onSuccess, error: onError });
        }
    }

    confirmDelete(tenant: Tenant): void {
        this.confirmationService.confirm({
            message: `Delete tenant "${tenant.name}"? This cannot be undone.`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.delete(tenant.id)
        });
    }

    private delete(id: string): void {
        this.tenantService.delete(id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tenant deleted' });
                this.load();
            },
            error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: extractErrorMessage(err, 'Delete failed') })
        });
    }
}