import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { CheckoutModal } from './components/checkout-modal/checkout-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CheckoutModal],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-checkout-modal></app-checkout-modal>
  `,
  styleUrl: './app.scss'
})
export class App {}
