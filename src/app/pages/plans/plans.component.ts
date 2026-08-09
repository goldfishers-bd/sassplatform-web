import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PlanService } from '../../core/services/plan.service';
import { Plan } from '../../core/models/plan.models';

@Component({
    selector: 'app-plans',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, SelectModule, ToggleSwitchModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './plans.component.html'
})
export class PlansComponent implements OnInit {
    private planService = inject(PlanService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    plans = signal<Plan[]>([]);
    loading = signal(false);
    dialogVisible = signal(false);
    isEditMode = signal(false);
    saving = signal(false);

    billingCycleOptions = [
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Yearly', value: 'Yearly' }
    ];

    form = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        description: [''],
        price: [0, [Validators.required, Validators.min(0)]],
        billingCycle: ['Monthly', Validators.required],
        maxUsers: [1, [Validators.required, Validators.min(1)]],
        isActive: [true]
    });

    ngOnInit(): void { this.load(); }

    load(): void {
        this.loading.set(true);
        this.planService.getAll().subscribe({
            next: (data) => { this.plans.set(data); this.loading.set(false); },
            error: () => { this.loading.set(false); this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load plans' }); }
        });
    }

    openCreate(): void {
        this.isEditMode.set(false);
        this.form.reset({ id: '', name: '', description: '', price: 0, billingCycle: 'Monthly', maxUsers: 1, isActive: true });
        this.dialogVisible.set(true);
    }

    openEdit(plan: Plan): void {
        this.isEditMode.set(true);
        this.form.reset({
            id: plan.id, name: plan.name, description: plan.description ?? '',
            price: plan.price, billingCycle: plan.billingCycle, maxUsers: plan.maxUsers, isActive: plan.isActive
        });
        this.dialogVisible.set(true);
    }

    save(): void {
        if (this.form.invalid) return;
        this.saving.set(true);
        const v = this.form.getRawValue();

        const onSuccess = () => {
            this.saving.set(false);
            this.dialogVisible.set(false);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `Plan ${this.isEditMode() ? 'updated' : 'created'}` });
            this.load();
        };

        const onError = (err: any) => {
            this.saving.set(false);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.title ?? 'Save failed' });
        };

        if (this.isEditMode()) {
            this.planService.update({
                id: v.id!,
                name: v.name!,
                description: v.description ?? undefined,
                price: v.price!,
                billingCycle: v.billingCycle as 'Monthly' | 'Yearly',
                maxUsers: v.maxUsers!,
                isActive: v.isActive!
            }).subscribe({ next: onSuccess, error: onError });
        } else {
            this.planService.create({
                name: v.name!,
                description: v.description ?? undefined,
                price: v.price!,
                billingCycle: v.billingCycle as 'Monthly' | 'Yearly',
                maxUsers: v.maxUsers!
            }).subscribe({ next: onSuccess, error: onError });
        }
    }

    confirmDelete(plan: Plan): void {
        this.confirmationService.confirm({
            message: `Delete plan "${plan.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.delete(plan.id)
        });
    }

    private delete(id: string): void {
        this.planService.delete(id).subscribe({
            next: () => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plan deleted' }); this.load(); },
            error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.title ?? 'Delete failed' })
        });
    }
}