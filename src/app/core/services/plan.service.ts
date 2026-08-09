import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/api-endpoints';
import { Plan, CreatePlanRequest, UpdatePlanRequest } from '../models/plan.models';

@Injectable({ providedIn: 'root' })
export class PlanService {
    private readonly baseUrl = `${environment.apiUrl}/${ApiEndpoints.plans}`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Plan[]> {
        return this.http.get<Plan[]>(this.baseUrl + '/get-all');
    }

    create(dto: CreatePlanRequest): Observable<Plan> {
        return this.http.post<Plan>(this.baseUrl + '/create', dto);
    }

    update(dto: UpdatePlanRequest): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/update/${dto.id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
    }
}