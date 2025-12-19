import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { SelectionState } from '../../services/selection-state';
import { Option as _Option } from '../../models/selection';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-option',
  imports: [AsyncPipe],
  templateUrl: './option.html',
  styleUrl: './option.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option {
  @Input({ required: true }) option!: _Option;
  @Input({ required: true })
  set boxId(value: number) {
    this.boxIdSubject.next(value);
  }

  private readonly boxIdSubject = new BehaviorSubject<number>(0);


  readonly isSelected$: Observable<boolean> = this.boxIdSubject.pipe(
    switchMap(boxId =>
      this.state.selectionForBox$(boxId).pipe(
        map(selection => selection?.optionId === this.option.id)
      )
    )
  );

  constructor(private readonly state: SelectionState) { }

  onSelect(): void {
    this.state.selectOption(this.boxIdSubject.value, this.option.id);
  }
}
