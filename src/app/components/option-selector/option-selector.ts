import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Option as OptionCmp } from '../option/option';
import { Observable } from 'rxjs';
import { Options } from '../../services/options';
import { Option } from '../../models/selection';
import { SelectionState } from '../../services/selection-state';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-option-selector',
  imports: [AsyncPipe, OptionCmp],
  templateUrl: './option-selector.html',
  styleUrl: './option-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionSelector {
  readonly activeBoxId$: Observable<number>;
  options: Option[];

  constructor(
    private readonly state: SelectionState,
    private readonly optionsService: Options
  ) {
    this.activeBoxId$ = this.state.activeBoxId$;
    this.options = this.optionsService.getOptions();
  }
}
