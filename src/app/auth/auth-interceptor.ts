import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { tap } from 'rxjs/operators';
import { Observable } from "rxjs";
import { SnackbarComponent } from "../shared/snackbar/snackbar.component";

// It's noting but an service so inject it but in different manner as of normal service
@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private snackbar: SnackbarComponent) { }

    // As req. is set with any so it will take every outgoing request
    // next will forward it to any next function if any called
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // get the auth token
        const authToken: any = this.authService.getToken();
        // need to clone every outgoing HttpRequest Instance as it's an Immutable
        const requestToken = req.clone({
            // set will just add this Authorization header to this outgoing request and if this request already have an Authorization header then it will simply overright the Authorization header only.
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        });
        // sending the cloned request now
        // return next.handle(requestToken);

        return next.handle(requestToken).pipe(
            tap(() => {}, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    console.error(err);
                    console.log(err.status);
                    if (err.status === 403) {
                        this.authService.doLogout();
                        this.snackbar.snackbarError('You have been logged out, please login again!');
                    }
                }
                return err;
            })
        );
    }
}
