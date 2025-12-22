import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { SelectionService } from '../services/selection';

@Component({
  selector: 'app-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DecimalPipe],
  template: `
    <div class="box" 
         [class.active]="(store.activeBoxId | async) === boxId" 
         (click)="store.setActiveBox(boxId)">
      
      <div class="box-id-wrapper"> 
        <span class="box-id">{{ boxId }}</span>
      </div>

      @if (store.getSelectionForBox(boxId) | async; as selection) {
        @if (selection.optionLabel) {
          <div class="selected-option">
            {{ selection.optionLabel }}
          </div>
        } @else {
          <div class="placeholder">Select element</div>
        }

        <div class="bottom-wrapper">
          <span class="box-segment"></span>
          <span class="box-segment">
            @if (selection.optionLabel) {
              {{ store.getSubtotalForBox(boxId) | async | number:'1.1-1' }}
            }
          </span>
          <span class="box-segment"></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .box { border: 1px solid rgba(255, 255, 255, 0.507); height: 174px; padding: 0 12px; cursor: pointer; position: relative; background: white; }
    .box:hover { background-color: #eee; }
    .box.active { background-color: rgba(172, 255, 47, 0.349); }
    .box-id-wrapper { position: absolute; top: 0; left: 0; background-color: #eee; width: 100%; height: 24px; }
    .box.active .box-id-wrapper { background-color: rgba(172, 255, 47, 0.349); }
    .box-id { position: absolute; top: 0px; left: 0; padding: 0 4px; background: white; font-weight: bold; font-size: 12px; }
    .selected-option { font-size: 74px; position: absolute; top: 10%; left: 8%; font-weight: bold; }
    .placeholder { position: relative; top: 40%; font-size:14px; text-align: center; color: #999; }
    .bottom-wrapper { position: absolute; bottom: 0; left: 0; width: 100%; display: flex; justify-content: space-evenly; gap: 1px; }
    .box-segment { height: 24px; background-color: #eee; width: 100%; text-align: center; line-height: 24px; font-size: 12px; }
    .box.active .box-segment { background-color: rgba(172, 255, 47, 0.349); }
  `]
})
export class BoxComponent {
  @Input({ required: true }) boxId!: number;
  store = inject(SelectionService);
}