import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/api-endpoints';
import { Subscription, ChangePlanRequest } from '../models/subscription.models';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCurrent(): Observable<Subscription> {
        return this.http.get<Subscription>(`${this.baseUrl}/${ApiEndpoints.subscriptions.current}`);
    }

    changePlan(dto: ChangePlanRequest): Observable<Subscription> {
        return this.http.put<Subscription>(`${this.baseUrl}/${ApiEndpoints.subscriptions.changePlan}`, dto);
    }
}