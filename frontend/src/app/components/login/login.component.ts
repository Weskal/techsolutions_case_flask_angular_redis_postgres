import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        // Seu backend retorna { "message": "credenciais inválidas" }
        this.errorMessage = error.error?.message || 'Usuário ou senha inválidos';
        console.error('Login error:', error);
      }
    });
  }
}