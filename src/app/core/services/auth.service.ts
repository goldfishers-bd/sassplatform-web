import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/auth.models';

interface DecodedToken {
    sub: string;
    email: string;
    tenantId: string;
    role?: string | string[];
    exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly tokenKey = 'access_token';
    private readonly refreshKey = 'refresh_token';

    private _isAuthenticated = signal<boolean>(this.hasValidToken());
    isAuthenticated = computed(() => this._isAuthenticated());

    constructor(private http: HttpClient, private router: Router) { }

    login(dto: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dto)
            .pipe(tap(res => this.setSession(res)));
    }

    signup(dto: SignupRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signup`, dto)
            .pipe(tap(res => this.setSession(res)));
    }

    refreshToken(): Observable<AuthResponse> {
        const refreshToken = localStorage.getItem(this.refreshKey);
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
            .pipe(tap(res => this.setSession(res)));
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshKey);
        this._isAuthenticated.set(false);
        this.router.navigate(['/auth/login']);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshKey);
    }

    getDecodedToken(): DecodedToken | null {
        const token = this.getAccessToken();
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch {
            return null;
        }
    }

    hasRole(role: string): boolean {
        const decoded = this.getDecodedToken();
        if (!decoded?.role) return false;
        return Array.isArray(decoded.role) ? decoded.role.includes(role) : decoded.role === role;
    }

    private setSession(res: AuthResponse): void {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.refreshKey, res.refreshToken);
        this._isAuthenticated.set(true);
    }

    private hasValidToken(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;
        try {
            const decoded: DecodedToken = JSON.parse(atob(token.split('.')[1]));
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }
}