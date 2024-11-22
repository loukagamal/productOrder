import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import { HttpClient } from '@angular/common/http';
import { selectedProducts } from "../models/selectedProducts.model";


@Injectable({
  providedIn: 'root',
})
export class DataService {
  private productsUrl = 'assets/json/porducts.json';
  private ordersUrl = 'assets/json/orders.json';
  private usersUrl = 'assets/json/users.json';
  selectedProducts:selectedProducts[]=[];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }
  editProductQuantity(productId: number, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.ordersUrl}/${productId}`, {
      AvailablePieces: quantity,
    });
  }
}
