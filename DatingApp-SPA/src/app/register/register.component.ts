import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(private authServ: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authServ.register(this.model).subscribe(() => {
      this.alertify.success('Registration successful');
      // tslint:disable-next-line: no-shadowed-variable
    }, error => {
      this.alertify.error(error);
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
    this.alertify.message('Canceled');

  }
}
