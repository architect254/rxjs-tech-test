import { AsyncPipe, DecimalPipe } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input, inject } from "@angular/core";
import { SelectionService } from "../services/selection";

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
              {{ selection.optionValue | number:'1.1-1' }}
            }
          </span>
          <span class="box-segment"></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .box { 
      border: 1px solid #ddd; 
      height: 174px; 
      cursor: pointer; 
      position: relative; 
      background: white; 
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .box:hover { background-color: #f8f9fa; }
    .box.active { background-color: rgba(172, 255, 47, 0.3); }

    .box-id-wrapper { 
      position: absolute; 
      top: 0; 
      left: 0; 
      background-color: #eee; 
      width: 100%; 
      height: 24px; 
      z-index: 1;
    }

    .box.active .box-id-wrapper { background-color: rgba(172, 255, 47, 0.5); }

    .box-id { 
      position: absolute; 
      top: 0px; 
      left: 0; 
      padding: 0 6px; 
      background: white; 
      font-weight: bold; 
      font-size: 11px; 
    }

    .selected-option { 
      /* Dynamically scales font between 40px and 74px */
      font-size: clamp(40px, 8vw, 74px); 
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -55%); 
      font-weight: bold; 
      color: #2c3e50;
      white-space: nowrap;
    }

    .placeholder { 
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%);
      font-size: 12px; 
      text-align: center; 
      color: #aaa; 
    }

    .bottom-wrapper { 
      position: absolute; 
      bottom: 0; 
      left: 0; 
      width: 100%; 
      display: flex; 
      gap: 1px; 
    }

    .box-segment { 
      height: 24px; 
      background-color: #eee; 
      flex: 1; 
      text-align: center; 
      line-height: 24px; 
      font-size: 11px; 
      color: #555;
    }

    .box.active .box-segment { background-color: rgba(172, 255, 47, 0.5); }
  `]
})
export class BoxComponent {
  @Input({ required: true }) boxId!: number;
  store = inject(SelectionService);
}