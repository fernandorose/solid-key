import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Admin, User, UserResponse } from '../../interfaces/user.interface';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  admins: any[] = [];
  users: any[] = [];

  constructor(
    private usersService: UsersService,
    private cookiesService: CookieService
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.usersService.loginUser(email!, password!).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.cookiesService.set('token', response.token, 1, '/');
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  ngOnInit() {
    this.usersService.getAllUsers().subscribe((response: UserResponse) => {
      this.users = response.users;
      this.admins = response.admins;
      console.log('admins', this.admins);
    });
  }
}
