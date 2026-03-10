import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/poduct-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products-component.html',
  styleUrls: ['./products-component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  productForm!: FormGroup;
  showModal = false; // pour add/update
  showDeleteModal = false; // pour delete confirmation
  productToDelete: Product | null = null;
  notification: string | null = null;

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initForm();
  }

  initForm(): void {
  this.productForm = this.fb.group({
    name: [
      '', 
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]{2,20}$/) // alphabets + chiffres, longueur 2-20
      ]
    ],
    price: [
      0,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]
    ],
    quantity: [
      0,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(10000)
      ]
    ]
  });
}

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => (this.products = data));
  }

  openAddModal(): void {
    this.selectedProduct = null;
    this.productForm.reset({ name: '', price: 0, quantity: 0 });
    this.showModal = true;
  }

  openUpdateModal(product: Product): void {
    this.selectedProduct = product;
    this.productForm.patchValue({ ...product });
    this.showModal = true;
  }

  saveProduct(): void {
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched(); // pour afficher les erreurs
    return;
  }

  const formValue = this.productForm.value;
  if (this.selectedProduct && this.selectedProduct.id) {
    const updated: Product = { ...this.selectedProduct, ...formValue };
    this.productService.updateProduct(updated).subscribe(() => {
      this.loadProducts();
      this.showModal = false;
      this.showNotification('Product updated successfully');
    });
  } else {
    this.productService.addProduct(formValue).subscribe(() => {
      this.loadProducts();
      this.showModal = false;
      this.showNotification('Product added successfully');
    });
  }
}

  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  deleteProduct(): void {
  if (this.productToDelete?.id != null) {
    this.productService.deleteProduct(this.productToDelete.id).subscribe(() => {
      this.loadProducts();
      this.showDeleteModal = false;
      this.showNotification('Product deleted successfully');
    });
  }
}

  cancelDelete(): void {
    this.productToDelete = null;
    this.showDeleteModal = false;
  }

  clearForm(): void {
    this.productForm.reset({ name: '', price: 0, quantity: 0 });
    this.selectedProduct = null;
  }

  showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => (this.notification = null), 3000); // notification auto-hide après 3s
  }
}