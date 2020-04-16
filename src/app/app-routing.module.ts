import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceMarkComponent } from './teacher/attendance-mark/attendance-mark.component';
import { AttendanceViewComponent } from './teacher/attendance-view/attendance-view.component';
import { ReportComponent } from './teacher/report/report.component';


const routes: Routes = [
  {
    path:'',
    component:AttendanceMarkComponent
  },
  {
    path:'view',
    component:AttendanceViewComponent
  },
  {
    path:'report',
    component:ReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
