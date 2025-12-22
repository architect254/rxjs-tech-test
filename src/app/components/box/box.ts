import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  BehaviorSubject,
  Observable,
  switchMap
} from 'rxjs';
import { SelectionState, BoxSelection } from '../../services/selection-state';

@Component({
  selector: 'app-box',
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './box.html',
  styleUrl: './box.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Box {
  @Input({ required: true })
  set boxId(value: number) {
    this.boxIdSubject.next(value);
  }

  @Output() public onBoxActivated = new EventEmitter()

  private readonly boxIdSubject = new BehaviorSubject<number>(0);
  public readonly boxId$ = this.boxIdSubject.asObservable()

  private readonly state: SelectionState = inject(SelectionState)

  readonly isActive$: Observable<boolean> =
    this.boxIdSubject.pipe(
      switchMap(boxId => this.state.isBoxActive$(boxId))
    );

  readonly selection$: Observable<BoxSelection | undefined> =
    this.boxIdSubject.pipe(
      switchMap(boxId => this.state.selectionForBox$(boxId))
    );

  readonly subtotal$: Observable<{ expression: string; result: number }> =
    this.boxIdSubject.pipe(
      switchMap(boxId => this.state.subtotalForBox$(boxId))
    );


  onBoxClick(): void {
    this.state.activateBox(this.boxIdSubject.value);
    this.onBoxActivated.emit(true)
  }
}
