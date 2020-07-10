import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]>{
        pageNumber = 1;
        pageSize = 5;
        messageContainer = 'Unread';

        constructor(private userServ: UserService,
                private authServ: AuthService,
                private router: Router,
                private alertify: AlertifyService) { }

        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Message[]> {
                return this.userServ.getMessages(this.authServ.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer)
                        .pipe(
                                catchError(error => {
                                        this.alertify.error('Probleme retrieving data');
                                        this.router.navigate(['/home']);

                                        return of(null);
                                })
                        );
        }

}
