import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        this.successMessage = 'Cadastro realizado com sucesso! Redirecionando...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        // Seu backend retorna { "message": "erro" }
        if (error.error?.message) {
          if (error.error.message === 'username_already_exists') {
            this.errorMessage = 'Nome de usuário já existe';
          } else {
            this.errorMessage = error.error.message;
          }
        } else {
          this.errorMessage = 'Erro ao cadastrar usuário';
        }
        console.error('Register error:', error);
      }
    });
  }
}