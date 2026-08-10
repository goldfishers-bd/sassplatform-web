import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/api-endpoints';
import { TenantUser } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly baseUrl = `${environment.apiUrl}/${ApiEndpoints.users}`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<TenantUser[]> {
        return this.http.get<TenantUser[]>(this.baseUrl);
    }

    deactivate(id: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${id}/deactivate`, {});
    }

    reactivate(id: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${id}/reactivate`, {});
    }
}