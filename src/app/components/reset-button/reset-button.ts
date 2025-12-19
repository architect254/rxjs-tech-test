import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SelectionState } from '../../services/selection-state';

@Component({
  selector: 'app-reset-button',
  imports: [],
  templateUrl: './reset-button.html',
  styleUrl: './reset-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetButton {
  private readonly state: SelectionState = inject(SelectionState)

  onReset(): void {
    this.state.resetAll();
  }
}
