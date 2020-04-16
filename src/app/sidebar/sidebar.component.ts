import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  teacher_id:string = ''
  style0={
    backgroundColor:'lightgrey'
  }
  style1={
    
  }
  style2={
    
  }
  

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private teacherService:TeacherService) {
    
  }
  ngOnInit(): void {
    this.teacherService.teacherEvent.subscribe(id=>{
      this.teacher_id = id
    })
    this.teacherService.getTeacher()
  }
  
  clicked(id){
    const grey = {
      backgroundColor:'lightgrey'
    }
    const nothing = {
      backgroundColor:''
    }
    if(id==0){
      this.style0 = grey
      this.style1 = nothing
      this.style2 = nothing
    }else if(id==1){
      this.style0 = nothing
      this.style1 = grey
      this.style2 = nothing
    }else if(id==2){
      this.style0 = nothing
      this.style1 = nothing
      this.style2 = grey
    }

  }



}
