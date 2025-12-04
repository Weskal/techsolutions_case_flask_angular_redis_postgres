import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showForm: boolean = false;
  editMode: boolean = false;
  
  currentProduct: Partial<Product> = {
    name: '',
    brand: '',
    price: 0
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Erro ao carregar produtos';
      }
    });
  }

  openCreateForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.currentProduct = { name: '', brand: '', price: 0 };
  }

  openEditForm(product: Product): void {
    this.showForm = true;
    this.editMode = true;
    this.currentProduct = { ...product };
  }

  closeForm(): void {
    this.showForm = false;
    this.currentProduct = { name: '', brand: '', price: 0 };
  }

  saveProduct(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentProduct.name || !this.currentProduct.price) {
      this.errorMessage = 'Nome e preço são obrigatórios';
      return;
    }

    if (this.editMode && this.currentProduct.id) {
      this.productService.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: (response) => {
          this.successMessage = 'Produto atualizado! Aguardando processamento...';
          setTimeout(() => {
            this.loadProducts();
            this.closeForm();
            this.successMessage = '';
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Erro ao atualizar produto';
        }
      });
    } else {
      this.productService.createProduct(this.currentProduct).subscribe({
        next: (response) => {
          this.successMessage = 'Produto criado! Aguardando processamento...';
          setTimeout(() => {
            this.loadProducts();
            this.closeForm();
            this.successMessage = '';
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Erro ao criar produto';
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          this.successMessage = 'Produto excluído! Aguardando processamento...';
          setTimeout(() => {
            this.loadProducts();
            this.successMessage = '';
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Erro ao excluir produto';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}