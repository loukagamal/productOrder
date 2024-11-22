import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Order } from '../../../core/models/order.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.fetchProducts();
  }

  fetchOrders(): void {
    this.dataService.getOrders().subscribe({
      next: (data) => {
        // Fix the date format for each order
        this.orders = data.map(order => ({
          ...order,
          OrderDate: this.fixDateFormat(order.OrderDate),
        }));
      },
      error: (err) => console.error('Error fetching orders:', err),
    });
  }

  fetchProducts(): void {
    this.dataService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  calculateTotal(order: Order): number {
    return order.Products.reduce((total, item) => {
      const product = this.products.find(p => p.ProductId === item.ProductId);
      return total + (product ? product.ProductPrice * item.Quantity : 0);
    }, 0);
  }

  // Utility to fix the malformed date string
  fixDateFormat(dateString: string): string {
    const correctedDate = dateString.replace(/(\d{4})(\d{2}:\d{2}:\d{2})/, '$1 $2');
    return new Date(correctedDate).toISOString();
  }
}
