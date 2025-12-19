import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged } from "rxjs";
import { BoxSelection } from "../models/selection";
import { Options } from "./options";

@Injectable({ providedIn: 'root' })
export class SelectionState {
  private readonly BOX_COUNT = 10;

  // ────────────── base state ──────────────

  private readonly activeBoxIdSubject = new BehaviorSubject<number>(1);
  readonly activeBoxId$ = this.activeBoxIdSubject.asObservable();

  private readonly selectionsSubject = new BehaviorSubject<BoxSelection[]>(
    this.loadInitialState()
  );
  readonly selections$ = this.selectionsSubject.asObservable();

  // ────────────── derived helpers ──────────────

  private readonly optionsService: Options = inject(Options)

  private readonly optionsMap = this.optionsService.getOptionsMap();


  // ────────────── selectors ──────────────

  isBoxActive$(boxId: number) {
    return this.activeBoxId$.pipe(
      map(active => active === boxId),
      distinctUntilChanged()
    );
  }

  selectionForBox$(boxId: number) {
    return this.selections$.pipe(
      map(selections => selections.find(s => s.boxId === boxId)),
      distinctUntilChanged()
    );
  }

  boxExpression$(boxId: number) {
    return this.selectionForBox$(boxId).pipe(
      map(selection =>
        selection?.optionId
          ? this.optionsMap.get(selection.optionId)?.operation ?? null
          : null
      )
    );
  }

  subtotalForBox$(boxId: number) {
    return this.selections$.pipe(
      map(selections => this.calculateSubtotal(selections, boxId))
    );
  }

  readonly total$ = this.selections$.pipe(
    map(selections => this.calculateTotal(selections))
  );

  // ────────────── events ──────────────

  activateBox(boxId: number): void {
    this.activeBoxIdSubject.next(boxId);
  }

  selectOption(boxId: number, optionId: string): void {
    const updated = this.selectionsSubject.value.map(s =>
      s.boxId === boxId ? { ...s, optionId } : s
    );

    this.selectionsSubject.next(updated);
    this.persist(updated);

    if (boxId < this.BOX_COUNT) {
      this.activateBox(boxId + 1);
    }
  }

  resetAll(): void {
    const reset = this.createEmptyState();
    this.selectionsSubject.next(reset);
    this.persist(reset);
    this.activateBox(1);
  }

  // ────────────── pure logic ──────────────

  private calculateSubtotal(
    selections: BoxSelection[],
    boxId: number
  ) {
    const ops = selections
      .filter(s => s.boxId <= boxId && s.optionId)
      .map(s => this.optionsMap.get(s.optionId!)?.operation)
      .filter((op): op is string => !!op);

    return this.evaluateOperations(ops);
  }

  private calculateTotal(selections: BoxSelection[]) {
    const ops = selections
      .filter(s => s.optionId)
      .map(s => this.optionsMap.get(s.optionId!)?.operation)
      .filter((op): op is string => !!op);

    return this.evaluateOperations(ops).result;
  }

  private evaluateOperations(ops: string[]) {
    if (ops.length === 0) {
      return { expression: '', result: 0 };
    }

    let result = Number(ops[0].slice(1));
    const expression = [ops[0]];

    for (let i = 1; i < ops.length; i++) {
      result = applyOperation(result, ops[i]);
      expression.push(ops[i]);
    }

    return { expression: expression.join(' '), result };
  }

  // ────────────── persistence ──────────────

  private createEmptyState(): BoxSelection[] {
    return Array.from({ length: this.BOX_COUNT }, (_, i) => ({
      boxId: i + 1,
      optionId: null
    }));
  }

  private persist(state: BoxSelection[]): void {
    localStorage.setItem('box-selections', JSON.stringify(state));
  }

  private loadInitialState(): BoxSelection[] {
    const raw = localStorage.getItem('box-selections');
    return raw ? JSON.parse(raw) : this.createEmptyState();
  }
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