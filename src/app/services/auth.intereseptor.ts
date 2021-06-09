import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

export class AuthIntereceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
       console.log("Intereceptor request", req)

       const cloned = req.clone({
           headers: req.headers.append("Auth_header", "SOME RANDOM TOKEN")
       })

       return next.handle(cloned).pipe(
           tap(event => {
                if(event.type === HttpEventType.Response){
                    console.log('Intereceptor response ', event)
                }
           })
       )
    }
}