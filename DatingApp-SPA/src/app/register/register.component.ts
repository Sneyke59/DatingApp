import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();

  user: User;

  registerForm: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private authServ: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authServ.register(this.user).subscribe(() => {
        this.alertify.success('Registration successful');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authServ.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
    this.alertify.message('Canceled');

  }

  isUserNameInvalid = () => this.registerForm.get('username').errors && this.registerForm.get('username').touched;
  isKnownAsInvalid = () => this.registerForm.get('knownAs').errors && this.registerForm.get('knownAs').touched;
  isDateOfBirthInvalid = () => this.registerForm.get('dateOfBirth').errors && this.registerForm.get('dateOfBirth').touched;
  isCityInvalid = () => this.registerForm.get('city').errors && this.registerForm.get('city').touched;
  isCountryInvalid = () => this.registerForm.get('country').errors && this.registerForm.get('country').touched;

  isPasswordValid(): string {
    if (!this.registerForm.get('password').touched) {
      return 'OK';
    }

    if (this.registerForm.get('password').hasError('minlength')) {
      return 'Password must be at least 4 characters';
    }

    if (this.registerForm.get('password').hasError('maxlength')) {
      return 'Password must not exceed 8 characters';
    }

    if (this.registerForm.get('password').errors) {
      return 'Password is required';
    }

    return 'OK';
  }

  isConfirmPasswordInvalid(): string {
    if (!this.registerForm.get('confirmPassword').touched) {
      return 'OK';
    }

    if (this.registerForm.hasError('mismatch')) {
      return 'Passwords must match';
    }

    if (this.registerForm.get('confirmPassword').errors) {
      return 'Password is required';
    }

    return 'OK';
  }
}
