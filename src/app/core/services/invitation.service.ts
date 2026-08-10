import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/api-endpoints';
import { Invitation, InviteUserRequest } from '../models/invitation.models';

@Injectable({ providedIn: 'root' })
export class InvitationService {
    private readonly baseUrl = `${environment.apiUrl}/${ApiEndpoints.invitations.base}`;

    constructor(private http: HttpClient) { }

    getPending(): Observable<Invitation[]> {
        return this.http.get<Invitation[]>(this.baseUrl);
    }

    invite(dto: InviteUserRequest): Observable<void> {
        return this.http.post<void>(this.baseUrl, dto);
    }
}