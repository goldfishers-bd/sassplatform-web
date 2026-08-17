import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SubscriptionService } from '../../core/services/subscription.service';
import { PlanService } from '../../core/services/plan.service';
import { Subscription } from '../../core/models/subscription.models';
import { Plan } from '../../core/models/plan.models';
import { extractErrorMessage } from '@/app/core/utils/error-utils';

@Component({
    selector: 'app-billing',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './billing.component.html'
})
export class BillingComponent implements OnInit {
    private subscriptionService = inject(SubscriptionService);
    private planService = inject(PlanService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    currentSubscription = signal<Subscription | null>(null);
    plans = signal<Plan[]>([]);
    loading = signal(false);
    switching = signal<string | null>(null); // planId currently being switched to

    activePlans = computed(() => this.plans().filter(p => p.isActive));

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        Promise.all([
            this.subscriptionService.getCurrent().toPromise(),
            this.planService.getAll().toPromise()
        ]).then(([sub, plans]) => {
            this.currentSubscription.set(sub ?? null);
            this.plans.set(plans ?? []);
            this.loading.set(false);
        }).catch(() => {
            this.loading.set(false);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load billing info' });
        });
    }

    isCurrentPlan(plan: Plan): boolean {
        return this.currentSubscription()?.planId === plan.id;
    }

    confirmSwitch(plan: Plan): void {
        this.confirmationService.confirm({
            message: `Switch to the ${plan.name} plan?`,
            header: 'Confirm Plan Change',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.switchPlan(plan)
        });
    }

    private switchPlan(plan: Plan): void {
        this.switching.set(plan.id);
        this.subscriptionService.changePlan({ newPlanId: plan.id }).subscribe({
            next: (sub) => {
                this.switching.set(null);
                this.currentSubscription.set(sub);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Switched to ${plan.name}` });
            },
            error: (err) => {
                this.switching.set(null);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: extractErrorMessage(err, 'Failed to switch plan') });
            }
        });
    }
}