import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/api-endpoints';
import { Profile, UpdateProfileRequest, ChangePasswordRequest } from '../models/profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private readonly baseUrl = `${environment.apiUrl}/${ApiEndpoints.profile.base}`;

    constructor(private http: HttpClient) { }

    get(): Observable<Profile> {
        return this.http.get<Profile>(this.baseUrl);
    }

    update(dto: UpdateProfileRequest): Observable<void> {
        return this.http.put<void>(this.baseUrl, dto);
    }

    changePassword(dto: ChangePasswordRequest): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/${ApiEndpoints.profile.changePassword}`, dto);
    }
}