import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged } from "rxjs";
import { Options } from "./options";

export interface BoxSelection {
  boxId: number;
  optionLabel: string | null;
}

@Injectable({ providedIn: 'root' })
export class SelectionState {
  private readonly BOX_COUNT = 10;

  // ────────────── base state ──────────────

  private readonly activeBoxIdSubject = new BehaviorSubject<number>(0);
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
        selection?.optionLabel
          ? this.optionsMap.get(selection.optionLabel)?.value ?? null
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

  selectOption(boxId: number, optionLabel: string): void {
    const updated = this.selectionsSubject.value.map(s =>
      s.boxId === boxId ? { ...s, optionLabel } : s
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
  }

  // ────────────── pure logic ──────────────

  private calculateSubtotal(
    selections: BoxSelection[],
    boxId: number
  ) {
    // 1. Grab all selections for this box and any previous boxes
    // 2. Map them to their numeric values using the label-based map
    const values = selections
      .filter(s => s.boxId <= boxId && s.optionLabel)
      .map(s => this.optionsMap.get(s.optionLabel!)?.value)
      .filter((v): v is number => v !== undefined);

    // 3. Perform a simple sum (addition)
    const result = values.reduce((acc, curr) => acc + curr, 0);

    // 4. Return an object consistent with your current UI needs
    return {
      result,
      expression: values.map(v => (v >= 0 ? `+${v}` : v)).join(' ')
    };
  }

  private calculateTotal(selections: BoxSelection[]) {
    return selections
      .map(s => (s.optionLabel ? this.optionsMap.get(s.optionLabel)?.value ?? 0 : 0))
      .reduce((acc, curr) => acc + curr, 0);
  }



  // ────────────── persistence ──────────────

  private createEmptyState(): BoxSelection[] {
    return Array.from({ length: this.BOX_COUNT }, (_, i) => ({
      boxId: i + 1,
      optionLabel: null
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