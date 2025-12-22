import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe, } from '@angular/common';
import { BoxComponent } from '../selection/components/box';
import { OptionSelectorComponent } from '../selection/components/option-selector';
import { SelectionService } from '../selection/services/selection';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, BoxComponent, OptionSelectorComponent, DecimalPipe],
  template: `
    <div class="dashboard">
      <div class="top-bar">
        <div class="total-score">
          <small>TOTAL</small>
          <h1>{{( store.total$ | async) | number:'1.1-1' }}</h1>
        </div>
        <button (click)="store.reset()" class="reset-btn">Reset</button>
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
    .dashboard { padding: 20px; font-family: sans-serif; }
    .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .total-score h1 { margin: 0; font-size: 3rem; color: #333; }
    .boxes-container {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 8px;
      margin-bottom: 30px;
    }
    .reset-btn { background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    @media (max-width: 800px) { .boxes-container { grid-template-columns: repeat(5, 1fr); } }
  `]
})
export class DashboardComponent {
  store = inject(SelectionService);

  trackByBoxId(index: number, item: any) {
    return item.boxId;
  }
}