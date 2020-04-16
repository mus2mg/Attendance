import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "src/app/database.service";
import { Subject, Attendance, Student } from "src/app/attendance.model";
import { TeacherService } from "src/app/teacher.service";
@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"],
})
export class ReportComponent implements OnInit {
  subjects: Subject[] = [];
  // Observable for update 
  current_teacher_id: string;
  selected_subject: string = undefined;
  data: NameValue[] = [];
  dataStudentAttendance:NameValue[]=[]
  view: any[] = [700, 400];
  dateSelected: Date;
  dateTo: Date = undefined;
  dateFrom: Date = undefined;
  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = "below";

  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
  };

  //bar chart
  xAxisLabel = 'Students'
  yAxisLabel = 'Attended Lectures'
  showXAxisLabel: boolean = true
  showYAxisLabel:boolean = true
  showXAxis: boolean = true
  showYAxis:boolean = true
  isFetchedStudents:boolean = false

  constructor(
    private dbservice: DatabaseService,
    private teacherservice: TeacherService
  ) {}

  ngOnInit(): void {
    this.teacherservice.teacherEvent.subscribe((t) => {
      this.current_teacher_id = t;
      this.dbservice.getSubjectsByTeacher(t).subscribe((data) => {
        this.subjects = data;
        this.data = [];
      });
    });
    this.teacherservice.getTeacher();
    this.dateTo = new Date()
    this.dateFrom = ReportComponent.addDays(this.dateTo,-7)
  }

  fetchAttendanceByDate(date: Date, subjects: Subject[]) {
    let attendance: Attendance[] = [];
    this.data = [];
    this.dbservice
      .getAttendanceByDateAndSubjects(date, subjects)
      .get()
      .then(
        (i) => {
          i.forEach((j) => {
            attendance.push({
              present: j.data().present,
              student_id: j.data().student_id,
              subject_id: j.data().subject_id,
              date: j.data().date,
            });
          });
          console.log("subjects", subjects);
          console.log("attendance", attendance);
          subjects.forEach((sub) => {
            let subjectAtt = attendance.filter(
              (at) => at.subject_id == sub.subject_id
            );
            let count: number = 0;
            let total: number = 0;
            subjectAtt.forEach((s) => {
              total += 1;
              if (s.present == true) {
                count += 1;
              }
            });
            if (count > 0) {
              if (total == 0) total = 1;
              this.data.push({
                name: sub.name,
                value: 100 * (count / total),
              });
              console.log(count / total);
            }
            console.log(this.data);
          });
          console.log("data selected after", this.data);
          this.data = [...this.data]
          this.isFetched = true;
        },
        (e) => {
          console.log(e, "fetchAttendanceByDate");
        }
      );
  }
  subjectSelected(obj) {
    this.selected_subject = obj.value;
    if(this.dateFrom!=undefined && this.dateTo!=undefined){
      this.fetchStudentAttendanceReport(this.dateFrom,this.dateTo)
    }
  }


  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  dateSelectedF(obj) {
    if (this.subjects.length > 0) {
      console.log("selected");
      this.fetchAttendanceByDate(obj, this.subjects);

      console.log(this.data.length, "length of data");
    }
  }
  isFetched: boolean = false;

  fetchStudentAttendanceReport(from:Date,to:Date){
    let attendance:Attendance[] = []
        let ids:Set<string> = new Set<string>()
        let students:Student[] = []
        this.dbservice.getAttendanceByDatesAndSubjectQuery(from, to,this.selected_subject).get().then(data=>{
          //fetched the attendance
          
          data.forEach(item=>{
            let it:Attendance = item.data() as Attendance
            attendance.push(it)
            ids.add(it.student_id)
          })
          console.log('did not get')
          if(ids.size>0){
            this.dbservice.getStudentsByIds(Array.from(ids)).get().then(dataStudents=>{
              dataStudents.forEach(s=>{
                students.push({
                  student_name:s.data().student_name,
                  student_id:s.data().student_id,
                  email:s.data().email,
                  roll_no:s.data().roll_no,
                })
              })
              ids.forEach(sid=>{
                let attByStudent:Attendance[] = attendance.filter(i=>i.student_id==sid)
                let count:number = 0
                attByStudent.forEach(at=>{
                  if(at.present){
                    count+=1
                  }
                })
                let _name:string = students.find(i=>i.student_id==sid).student_name
                this.dataStudentAttendance.push({
                  name:_name,
                  value:count
                })
              })
              this.dataStudentAttendance = [...this.dataStudentAttendance]
              console.log('got data')
              this.isFetchedStudents = true
            })
          }else{
            this.dataStudentAttendance = []
            console.log('empied')
          }
          
        });
  }

  dateSelectedF1(obj: Date, id) {
    if (id == 0) {
      if (this.dateTo != undefined && this.selected_subject != undefined) {
        this.fetchStudentAttendanceReport(obj,this.dateTo)
      }
    } else {
      if (this.dateFrom != undefined) {
        this.fetchStudentAttendanceReport(this.dateFrom,obj)
      }
    }
  }
  datesGenerator(from: Date, to: Date): Date[] {
    let dates: Date[] = [];
    let number_of_days;
    let n = from.getTime() - to.getTime();
    let d = -(n / (1000.0 * 60 * 60 * 24));
    d = Math.floor(d);
    number_of_days = d + 1;
    for (let index = 0; index < number_of_days; index++) {
      dates.push(ReportComponent.addDays(from, index));
    }

    return dates;
  }
  static addDays(date: Date, days: number): Date {
    var result: Date = new Date(date.toString());
    console.log(result);
    result.setDate(result.getDate() + days);
    console.log(result);
    return result;
  }
  
}

interface NameValue {
  name: string;
  value: number;
}
