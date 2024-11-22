import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { Order } from '../../../core/models/order.model';
import { Product } from '../../../core/models/product.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  customer: User | null = null;
  products: Product[] = [];
  orderProducts: any

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchOrderDetails(orderId);
  }

  fetchOrderDetails(orderId: number): void {
    this.dataService.getOrders().subscribe({
      next: (orders) => {
        this.order = orders.find((o) => o.OrderId === orderId) || null;

        if (this.order) {
          this.fetchCustomerDetails(this.order.UserId);
          this.fetchProductDetails();
        }
      },
      error: (err) => console.error('Error fetching order:', err),
    });
  }

  fetchCustomerDetails(userId: string): void {
    this.dataService.getUsers().subscribe({
      next: (users) => {
        this.customer = users.find((u) => u.Id === userId) || null;
      },
      error: (err) => console.error('Error fetching customer:', err),
    });
  }

  fetchProductDetails(): void {
    this.dataService.getProducts().subscribe({
      next: (products) => {
        this.products = products;

        if (this.order) {
          this.orderProducts = this.order.Products.map((orderProduct) => {
            const product = products.find((p) => p.ProductId === orderProduct.ProductId);
            const quantity = orderProduct.Quantity;
            const subtotal = product ? product.ProductPrice * quantity : 0;

            return { product: product || { ProductName: 'Unknown', ProductPrice: 0 }, quantity, subtotal };
          });
        }
      },
      error: (err) => console.error('Error fetching products:', err),
    });
  }
}
