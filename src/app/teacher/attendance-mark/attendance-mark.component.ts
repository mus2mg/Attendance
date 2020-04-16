import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';
import { StudentAttendance,Subject, Student } from 'src/app/attendance.model';
import { Observable, of } from 'rxjs';
import { TeacherService } from 'src/app/teacher.service';

@Component({
  selector: 'app-attendance-mark',
  templateUrl: './attendance-mark.component.html',
  styleUrls: ['./attendance-mark.component.css']
})
export class AttendanceMarkComponent implements OnInit {
  date:Date
  dateStr:string
  subjects:Subject[]=[]
  data:Observable<StudentAttendance[]>
  current_teacher_id:string
  selected_subject:string
  isDateSelectionDisabled:boolean = true
  button_text: string;
  isSubjectSelected:boolean = false;
  constructor(private dbservice:DatabaseService,private teacherService:TeacherService) {
      
      
      this.button_text = 'mark'
      
   }


  ngOnInit(): void {
    this.date = new Date()
    
    this.teacherService.teacherEvent.subscribe(i=>
      {
        this.current_teacher_id = i 
        console.log(this.current_teacher_id)
        this.dbservice.getSubjectsByTeacher(this.current_teacher_id).subscribe(data=>{
          this.subjects = data
        })
      }
    )
    this.teacherService.getTeacher()
    


  }

  show(obj:Date){
    
    
    
  }

  subjectSelected(obj){
    this.selected_subject = obj.value
    this.isSubjectSelected = true
    let s_a:StudentAttendance[] = []
    this.data = of(s_a)
    this.dbservice.getStudentsBySubject(this.selected_subject).subscribe(i=>{
      i.forEach(s=>{
        s_a.push({
          student_id:s.student_id as string,
          student_name:s.student_name as string,
          present:false
        } as StudentAttendance)
      })
      this.data = of(s_a)
    })
    
  }
  insert(){
    if(this.button_text=='mark'){
      this.data.subscribe(data=>{
        if(data.length>0){
          this.dbservice.insertAttendance(data,this.selected_subject,this.date)
        }
      })
    }else{
      this.data.subscribe(data=>{
        if(data.length>0){
          this.dbservice.updateAttendance(data,this.selected_subject,this.date)
        }
      })
    }
  }
  optionSelected(obj){
    if(obj.value=='1'){
      this.isDateSelectionDisabled = false
      this.button_text = 'update'
    }else if(obj.value=='2'){
      this.button_text = 'mark'
      this.isDateSelectionDisabled = false
    }else{
      this.date = new Date()
      this.isDateSelectionDisabled = true
      this.button_text = 'mark'
    }

  }

}
