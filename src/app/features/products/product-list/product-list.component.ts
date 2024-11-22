import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Product } from '../../../core/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.dataService.getProducts().subscribe({
      next: (data) => {
        this.products = data.sort(
          (a, b) => a.AvailablePieces - b.AvailablePieces
        );
      },
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  isLowStock(quantity: number): boolean {
    return quantity <= 5;
  }

  editQuantity(product: Product): void {
    const newQuantity = prompt(
      `Edit quantity for ${product.ProductName}:`,
      product.AvailablePieces.toString()
    );
    if (newQuantity !== null && !isNaN(Number(newQuantity))) {
      product.AvailablePieces = Number(newQuantity);

      this.dataService
        .editProductQuantity(product.ProductId, product.AvailablePieces)
        .subscribe({
          next: () => console.log(`Updated ${product.ProductName}`),
          error: (err) =>
            console.error(`Error updating ${product.ProductName}:`, err),
        });
    }
  }
  selectedProducts: any = [];
  toggleProductSelection(product: Product): void {
    const confirmDeselect = confirm(
      `Are you sure you want to add ${product.ProductName}?`
    );
    if(confirmDeselect){
      let productIndex;
      if (this.selectedProducts.length > 0) {
        productIndex = this.selectedProducts.findIndex(
          (item: any) => item.product.ProductId === product.ProductId
        );
        if (productIndex >= 0) {
          if (
            product.AvailablePieces > this.selectedProducts[productIndex].quantity
          ) {
            this.selectedProducts[productIndex] = {
              product: product,
              quantity: this.selectedProducts[productIndex]?.quantity + 1,
            };
          } else {
            alert('not fond quantity.');
          }
        } else {
          this.selectedProducts?.push({ product: product, quantity: 1 });
        }
      } else {
        this.selectedProducts?.push({ product: product, quantity: 1 });
      }
  
      this.dataService.selectedProducts = this.selectedProducts;
      console.log(this.selectedProducts);
    }
   
  }

  createOrder(): void {
    if (this.selectedProducts.length > 0) {
      this.router.navigate(['/orders/create'], {
        state: { selectedProducts: this.selectedProducts },
      });
    } else {
      alert('Please select products to create an order.');
    }
  }
}
