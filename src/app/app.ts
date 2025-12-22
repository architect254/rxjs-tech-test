import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { DashboardComponent } from "./features/dashboard/dashbord";

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'rxjs-tech-test';

}
