import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StudentAttendance, Subject,Report, Attendance, Student} from 'src/app/attendance.model';
import { DatabaseService } from 'src/app/database.service';
import { TeacherService } from 'src/app/teacher.service';
import { utils, write, WorkBook } from 'xlsx';

import { saveAs } from 'file-saver';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-attendance-view',
  templateUrl: './attendance-view.component.html',
  styleUrls: ['./attendance-view.component.css']
})
export class AttendanceViewComponent implements OnInit {
  selected_subject: string;
  selected_student:string;
  subjects: Subject[];
  students:Student[]=[];
  current_teacher_id: string = '';
  fromDate:Date
  toDate:Date
  number_of_days:number
  headers:string[]=['student_id','student_name']
  loopNumber:number[]
  datesForHeaders:Date[] = []
  isFetched:boolean = false
  data:Report[]=[
   
  ]
  subject_attendance:SubjectAttendance[] = []
  aggregate: any;

  static addDays(date:Date,days:number):Date{
    var result:Date = new Date(date.toString())
    console.log(result)
    result.setDate(result.getDate()+days)
    console.log(result)
    return result
  }


  constructor(private dbservice:DatabaseService, private teacherService:TeacherService) {
    this.toDate = new Date()
    
    
   }

  ngOnInit(): void {
    
    console.log(this.current_teacher_id,'asd')
    this.teacherService.teacherEvent.subscribe(i=>{
      console.log(this.current_teacher_id,'hel')
      this.current_teacher_id = i
      this.dbservice.getSubjectsByTeacher(this.current_teacher_id).subscribe(data=>{
        this.subjects = data
        console.log(this.subjects,'khu')
      },e=>{
        console.log(e)
      })
    },e=>{
      console.log(e)
    })
    this.teacherService.getTeacher()
    
  }
  
  printClick(){
    console.log('jello')
    saveAs(new Blob([this.s2ab(this.toExcel())],{type:'application/octet-stream'}),'attendance.xlsx')
    
  }
  s2ab(s){
    var buff = new ArrayBuffer(s.length)
    var view = new Uint8Array(buff)
    for (let index = 0; index < s.length; index++) {
      view[index] = s.charCodeAt(index) & 0xFF;
    }
    return buff
  }
  

  
  @ViewChild('mtable') myTable: ElementRef;
  toExcel(){
    console.log(this.myTable)
    let wb = utils.book_new()
    wb.Props = {
      Title:'Attendance Sheet',
      Subject:'attendance',
      Author:this.current_teacher_id,
      CreatedDate:new Date()
    }
    wb.SheetNames.push('attendance')
    let ws = utils.table_to_sheet(this.myTable.nativeElement)
    
    wb.Sheets['attendance'] = ws
    console.log('here')
    let wbout = write(wb,{bookType:'xlsx',type:'binary'})
    return wbout
  }

  subjectSelected(obj){
    this.selected_subject = obj.value
  }

  populateTable(from:Date){
    console.log('out',this.selected_subject)
    if(this.selected_subject!='' && this.selected_subject!=undefined){
      console.log('in')
      this.headers = ['student_id','student_name']
      this.datesForHeaders = []
      for(var i=0;i<=this.number_of_days;i++){
        this.headers.push(i.toString())
        this.datesForHeaders.push(AttendanceViewComponent.addDays(from,i))
      }
      console.log(this.datesForHeaders)
      
      this.dbservice.getAttendanceByDatesEmitter().subscribe((data:Attendance[])=>{
        console.log('in subscribe')
        this.loopNumber = []
        this.loopNumber = Array(this.number_of_days).fill(0)
        this.headers = ['student_id','student_name']
        this.data = this.attendancesToReports(data)
        if(this.data.length!=0){
          this.loopNumber = Array(this.data[0].date.length).fill(0)
          this.datesForHeaders = this.data[0].date
          for(var i=0;i<this.data[0].date.length;i++){
            this.headers.push(i.toString())
          }
          
        }
        let ids:string[] = []
        this.data.forEach(i=>{
          ids.push(i.student_id)
        })
        let s_id = this.dbservice.studentsEvent.subscribe((data:{id:string,name:string}[])=>{
          this.data.forEach(item=>{
            item.student_name = data.find(j=>item.student_id==j.id).name
          })
          this.isFetched = true
          s_id.unsubscribe()
        })
        this.dbservice.getStudentsByIdsComplete(ids)
      })
      this.dbservice.getAttendanceByDates(this.datesForHeaders,this.selected_subject)
    }
  }

  dateSelected(obj:Date,id){
    //id = 0 for datefrom
    
  
    if(id==0){
      let n = obj.getTime()-this.toDate.getTime()
      let d = -(n/(1000.0*60*60*24))
      d = Math.floor(d)
      this.number_of_days = d+1
      if(this.number_of_days>7){
        this.number_of_days = 7
        this.toDate = AttendanceViewComponent.addDays(obj,this.number_of_days)
      }
      
      this.populateTable(obj)
    }else{
      if(this.fromDate!=undefined){
        let n = this.fromDate.getTime()-obj.getTime()
        let d = -(n/(1000.0*60*60*24))
        d = Math.floor(d)
        this.number_of_days = d+1
        if(this.number_of_days>7){
          this.number_of_days = 7
          this.fromDate = AttendanceViewComponent.addDays(obj,-this.number_of_days)
          
        }
        this.populateTable(this.fromDate)
        
      }
    }
    
  }

  attendancesToReports(attendances:Attendance[]):Report[]{
    console.log('converter called')
    let id_set:Set<string> = new Set<string>()
    let reports:Report[] = []
    attendances.forEach(item=>id_set.add(item.student_id))
    console.log(id_set.size)
    id_set.forEach(item=>{
      console.log(item,'item')
      let per_person:Attendance[] = attendances.filter(i=>i.student_id==item)
      let p:boolean[] = []
      let d:Date[]  = []
      let presentAt:{present:boolean,date:Date}[] = []
      
      for(var i=0;i<per_person.length;i++){
        presentAt.push({
          present:per_person[i].present,
          date:new Date(per_person[i].date)
        })
      }
      console.log(presentAt,'presentat')
      presentAt.sort((a,b)=>{
        return (this.getTime(a.date) - this.getTime(b.date))
      })
      presentAt.forEach(item=>{
        p.push(item.present)
        d.push(item.date)
      })
      let r:Report = {
        present:p,
        date:d,
        subject_id:per_person[0].subject_id,
        student_id:item,
        student_name:''
      }
      reports.push(r)
    })
    console.log(reports)
    return reports
  }
  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  studentSelected(id){
    
    this.dbservice.attendance_by_student.subscribe((att:Attendance[])=>{
      this.subject_attendance = []
      this.subjects.forEach(sub=>{
        let find = att.filter(i=>i.subject_id==sub.subject_id)
        let count = 0
        let total_ = 0
        find.forEach(it=>{
          total_++
          if(it.present){
            count++
          }
          
        })
        this.subject_attendance.push({
          name:sub.name,
          subject_id:sub.subject_id,
          attended:count,
          total:total_
        })
      })
      console.log(this.subject_attendance,'attendance')
      console.log(this.subjects)
      let agg = 0
      let t_agg = 0
      this.subject_attendance.forEach(j=>{
        agg+=j.attended
        t_agg+=j.total
      })
      console.log('agg',agg,t_agg)
      if(t_agg!=0){
        this.aggregate = Math.floor(100*(agg/t_agg))
      }else{
        this.aggregate = Math.floor(100*agg)
      }
    })
    this.dbservice.getAttendanceByStudent(id.value)
  }

  studentTabSelected(tab:MatTabChangeEvent){
    if(tab.tab.textLabel=='student'){
      if(this.current_teacher_id){
        this.dbservice.students_by_teacher_event.subscribe(st=>{
          this.students = st
        })
        
        this.dbservice.getStudentsByTeacher(this.current_teacher_id)
      }
      
      
    }
  }


}

interface BoolDate{
  present:boolean,
  date:Date
}

interface SubjectAttendance{
  subject_id:string,
  name:string,
  attended:number,
  total:number
}