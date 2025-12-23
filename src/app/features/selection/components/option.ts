import { Component, Input, inject, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Option } from '../../../shared/models/selection.models';
import { SelectionService } from '../services/selection';

@Component({
  selector: 'app-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  template: `
    <div class="option" 
         [class.selected]="isSelected$ | async" 
         [attr.data-tooltip]="option.value"
         (click)="store.updateSelection(boxId, option)">
      {{ option.label }}
    </div>
  `,
  styles: [`
    .option { 
      background: white; 
      border: 1px solid #ddd; 
      padding: 10px 5px; 
      text-align: center; 
      font-weight: bold; 
      cursor: pointer; 
      position: relative; 
      transition: background 0.2s;
    }

    .option.selected { 
      background: #2c3e50 !important; 
      color: white !important; 
    }
    .option:hover { background-color: #f0f0f0; }
  `]
})
export class OptionComponent implements OnChanges {
  @Input({ required: true }) option!: Option;
  @Input({ required: true }) boxId!: number;

  store = inject(SelectionService);
  isSelected$!: Observable<boolean>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['boxId']) {
      this.isSelected$ = this.store.getSelectionForBox(this.boxId).pipe(
        map(selection => selection?.optionLabel === this.option.label)
      );
    }
  }
}