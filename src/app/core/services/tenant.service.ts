import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/api-endpoints';
import { Tenant, CreateTenantRequest, UpdateTenantRequest } from '../models/tenant.models';

@Injectable({ providedIn: 'root' })
export class TenantService {
    private readonly baseUrl = `${environment.apiUrl}/${ApiEndpoints.tenants}`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Tenant[]> {
        return this.http.get<Tenant[]>(this.baseUrl + '/get-all');
    }

    getById(id: string): Observable<Tenant> {
        return this.http.get<Tenant>(`${this.baseUrl}/get-by-id/${id}`);
    }

    create(dto: CreateTenantRequest): Observable<Tenant> {
        return this.http.post<Tenant>(this.baseUrl + '/create', dto);
    }

    update(dto: UpdateTenantRequest): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/update/${dto.id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
    }
}