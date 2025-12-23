import { AsyncPipe, DecimalPipe } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { BoxComponent } from "../selection/components/box";
import { OptionSelectorComponent } from "../selection/components/option-selector";
import { SelectionService } from "../selection/services/selection";

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, BoxComponent, OptionSelectorComponent, DecimalPipe],
  template: `
    <div class="dashboard">
      <div class="top-bar">
        <div class="total-score">
          <small>TOTAL</small>
          <h1>{{( store.total$ | async) | number:'1.2-2' }}</h1>
        </div>
        <button (click)="store.reset()" class="reset-btn">RESET</button>
      </div>

      <div class="boxes-container">
        @for (s of store.selections | async ; track s.boxId) {
          <app-box [boxId]="s.boxId" />
        }
      </div>

      <app-option-selector />
    </div>
  `,
  styles: [`
    .dashboard { 
      padding: 15px; 
      max-width: 1400px; 
      margin: 0 auto; 
      font-family: 'Segoe UI', system-ui, sans-serif; 
    }

    .top-bar { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      margin-bottom: 24px;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }

    .total-score small { color: #666; font-weight: bold; letter-spacing: 1px; }
    .total-score h1 { 
      margin: 0; 
      font-size: clamp(2rem, 5vw, 3.5rem); 
      color: #2c3e50; 
    }

    .boxes-container {
      display: grid;
      /* Default 10 columns */
      grid-template-columns: repeat(10, 1fr);
      gap: 8px;
      margin-bottom: 30px;
    }

    .reset-btn { 
      background: #e74c3c; 
      color: white; 
      border: none; 
      padding: 10px 20px; 
      border-radius: 4px; 
      cursor: pointer; 
      font-weight: bold;
    }

    /* Tablet: 5 columns */
    @media (max-width: 1024px) {
      .boxes-container { grid-template-columns: repeat(5, 1fr); }
    }

    /* Mobile: 2 columns */
    @media (max-width: 600px) {
      .boxes-container { grid-template-columns: repeat(2, 1fr); }
      .top-bar { flex-direction: column; align-items: flex-start; gap: 10px; }
      .reset-btn { width: 100%; }
    }
  `]
})
export class DashboardComponent {
  store = inject(SelectionService);
}