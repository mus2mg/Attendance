import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceMarkComponent } from './attendance-mark/attendance-mark.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core'
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { AttendanceViewComponent } from './attendance-view/attendance-view.component';
import { MatDividerModule } from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import { ReportComponent } from './report/report.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';



import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PercentagePipe } from '../percentage.pipe';
@NgModule({
  declarations: [
    AttendanceMarkComponent,
    AttendanceViewComponent,
    ReportComponent,
    PercentagePipe
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    NgxChartsModule,
    MatTabsModule,
    MatListModule
  ],
  providers:[MatDatepickerModule],
  exports:[AttendanceMarkComponent]
})
export class TeacherModule { }
