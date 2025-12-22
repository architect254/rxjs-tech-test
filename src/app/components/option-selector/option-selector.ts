import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Option as OptionCmp } from '../option/option';
import { Observable } from 'rxjs';
import { Options, OptionGroup } from '../../services/options';
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
  private readonly state: SelectionState = inject(SelectionState);
  private readonly optionsService: Options = inject(Options);

  public readonly activeBoxId$: Observable<number> = this.state.activeBoxId$;
  public readonly optionGroups: OptionGroup[] = this.optionsService.getGroupedOptions();


}
