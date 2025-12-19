import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { BoxSelection } from '../models/selection';
import { Options } from './options';

const STORAGE_KEY = 'box-selections';

@Injectable({
  providedIn: 'root',
})
export class SelectionState {
  constructor(
    private readonly optionsService: Options
  ) { }
  private readonly boxCount = 10;

  /** Active box */
  private readonly activeBoxIdSubject = new BehaviorSubject<number>(1);
  readonly activeBoxId$ = this.activeBoxIdSubject.asObservable();

  /** Selections per box */
  private readonly selectionsSubject = new BehaviorSubject<BoxSelection[]>(
    this.loadInitialState()
  );
  readonly selections$ = this.selectionsSubject.asObservable();

  /** Public selectors */

  selectionForBox$(boxId: number): Observable<BoxSelection | undefined> {
    return this.selections$.pipe(
      map(selections => selections.find(s => s.boxId === boxId)),
      distinctUntilChanged()
    );
  }

  isBoxActive$(boxId: number): Observable<boolean> {
    return this.activeBoxId$.pipe(
      map(activeId => activeId === boxId),
      distinctUntilChanged()
    );
  }

  /** Events */

  activateBox(boxId: number): void {
    this.activeBoxIdSubject.next(boxId);
  }

  selectOption(boxId: number, optionId: string): void {
    const updated = this.selectionsSubject.value.map(selection =>
      selection.boxId === boxId
        ? { ...selection, optionId }
        : selection
    );

    this.selectionsSubject.next(updated);
    this.persist(updated);

    if (boxId < this.boxCount) {
      this.activateBox(boxId + 1);
    }
  }

  resetAll(): void {
    const reset = this.createEmptyState();
    this.selectionsSubject.next(reset);
    this.persist(reset);
    this.activateBox(1);
  }

  /** Helpers */

  private createEmptyState(): BoxSelection[] {
    return Array.from({ length: this.boxCount }, (_, i) => ({
      boxId: i + 1,
      optionId: null,
      subtotal: null
    }));
  }

  private persist(state: BoxSelection[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private loadInitialState(): BoxSelection[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return this.createEmptyState();
    }
    return JSON.parse(raw);
  }

  subtotalForBox$(boxId: number) {
    return this.selections$.pipe(
      map(selections => {
        debugger
        const optionsMap = new Map(
          this.optionsService.getOptions().map(o => [o.id, o.operation])
        );

        const ops = selections
          .filter(s => s.boxId <= boxId && s.optionId)
          .map(s => optionsMap.get(s.optionId!))
          .filter((op): op is string => !!op);

        if (ops.length === 0) {
          return { expression: '', result: 0 };
        }

        // Initialize from first operation
        let result = Number(ops[0].slice(1));
        let expression = [ops[0]];

        for (let i = 1; i < ops.length; i++) {
          const op = ops[i];
          expression.push(op);
          result = applyOperation(result, op);
        }

        return {
          expression: expression.join(' '),
          result
        };
      })
    );
  }


  total$ = this.selections$.pipe(
    map(selections => {
      const optionsMap = new Map(
        this.optionsService.getOptions().map(o => [o.id, o.operation])
      );

      const ops = selections
        .filter(s => s.optionId)
        .map(s => optionsMap.get(s.optionId!))
        .filter((op): op is string => !!op);

      if (ops.length === 0) {
        return 0;
      }

      let result = Number(ops[0].slice(1));

      for (let i = 1; i < ops.length; i++) {
        result = applyOperation(result, ops[i]);
      }

      return result;
    })
  );

}


function applyOperation(current: number, operation: string): number {
  const operator = operation.charAt(0);
  const operand = Number(operation.slice(1));

  switch (operator) {
    case '+': return current + operand;
    case '-': return current - operand;
    case '*': return current * operand;
    case '/': return current / operand;
    default: return current;
  }
}
