import { Injectable, EventEmitter } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  Subject,
  Student,
  Attendance,
  StudentAttendance,
} from "./attendance.model";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  private attendanceByDates: EventEmitter<Attendance[]> = new EventEmitter<
    Attendance[]
  >();

  constructor(private dbCol: AngularFirestore) {
    dbCol
      .collection("attendance")
      .get()
      .subscribe((data) => {
        data.forEach((i) => console.log(i.data()));
      });
  }
  studentsEvent:EventEmitter<{id:string,name:string}[]> = new EventEmitter()
  public getStudentsByIdsComplete(ids:string[]){
    let names:{id:string,name:string}[] = []
    let names_arr = []
    let col = this.dbCol.collection('students')
    console.log(ids)
    let id = col.snapshotChanges().subscribe(data=>{
      data.forEach(i=>{
        let item:Student = i.payload.doc.data() as Student
        let find = ids.find(id=>id == item.student_id)
        if (find!=undefined) {
          names.push({
            id:find,
            name:item.student_name
          })
        }
        
        
      })
      
      this.studentsEvent.emit(names)
      id.unsubscribe()
    })

  }
  public getStudentsByIds(ids:string[]){
    let col = this.dbCol.collection('students')
    if(ids.length>0){
      let query = col.ref.where('student_id','in',ids)
      return query
    }
    else
      return undefined
  }
  public getAttendanceByDatesAndSubjectQuery(dateFrom:Date,dateTo:Date,subject_id:string){
    let dateStrings:string[] = []
    let dateTos = dateTo.toDateString()
    let dateFroms = dateFrom.toDateString()
    let col = this.dbCol.collection('attendance')
    let query = col.ref.where('subject_id','==',subject_id)
    /*
    dateStrings.forEach(date=>{
      console.log('this is a foreach',date)
      query = query.where('date','array-contains',date)
    })
    */
    query.where('date','<=',dateTos).where('date','>=',dateFroms)
    return query
  }
  public getAttendanceByDatesEmitter(): EventEmitter<Attendance[]> {
    return this.attendanceByDates;
  }

  getAttendanceByDate(date: Date) {
    let col = this.dbCol.collection("attendance");
    let query = col.ref.where("date", "==", date.toDateString());
    return query;
  }

  getAttendanceByDateAndSubjects(date: Date,subjects:Subject[]) {
    let subject_ids:string[] = []
    subjects.forEach(it=>{
      subject_ids.push(it.subject_id)
    })
    let col = this.dbCol.collection("attendance");
    let query = col.ref.where("date", "==", date.toDateString()).where('subject_id','in',subject_ids);
    return query;
  }

  getAttendanceByDates(dates: Date[], subject_id: string) {
    let dateStrings: string[] = [];
    dates.forEach((i) => dateStrings.push(i.toDateString()));
    console.log("datestring", dateStrings);
    let att_col = this.dbCol.collection("attendance");
    console.log("made till here", subject_id);

    let query = att_col.ref.where("subject_id", "==", subject_id);
    console.log("date query");
    let att: Attendance[] = [];
    query.get().then(
      (i) => {
        i.forEach((item) => {
          let item_ = item.data() as Attendance
          let find = dateStrings.findIndex(i=>i==item_.date)
          if(find!=-1){
            att.push({
              present: item.data().present,
              subject_id: item.data().subject_id,
              student_id: item.data().student_id,
              date: item.data().date,
            })
          }
          
        });
        this.attendanceByDates.emit(att);
        console.log(att, "something", i);
      },
      (e) => console.log(e)
    );
  }

  getStudentsBySubject(subject_id: string): EventEmitter<Student[]> {
    let col = this.dbCol.collection("student_subject");
    let query = col.ref.where("subject_id", "==", subject_id);
    let studentIds: string[] = [];
    let students: Student[] = [];
    let studentsEvent = new EventEmitter<Student[]>();

    query.get().then(
      (i) => {
        i.forEach((j) => {
          studentIds.push(j.data().student_id);
        });
        if (studentIds.length > 0) {
          let stud_col = this.dbCol.collection("students");
          stud_col.snapshotChanges().subscribe(data=>{
            data.forEach(it=>{
              let item_ = it.payload.doc.data() as Student
              let find = studentIds.findIndex(i=>i==item_.student_id)
              if(find!=-1){
                students.push(item_)
              }
            })
            studentsEvent.emit(students)
          })
          /*
          let stud_query = stud_col.ref.where("student_id", "in", studentIds);
          stud_query.get().then(
            (i) => {
              i.forEach((j) => {
                students.push({
                  student_id: j.data().student_id,
                  student_name: j.data().student_name,
                  roll_no: j.data().roll_no,
                  email: j.data().email,
                });
              });
              studentsEvent.emit(students);
            },
            (e) => console.log(e)
          );
          */
        }
      },
      (e) => console.log(e)
    );
    return studentsEvent;
  }

  updateAttendance(att: StudentAttendance[], sub: string, date: Date) {
    let col = this.dbCol.collection("attendance");
    let query = col.ref
      .where("date", "==", date.toDateString())
      .where("subject_id", "==", sub);
    query.get().then((i) => {
      if (i.size > 0) {
        i.docs.forEach((d) => {
          let rec = att.find((i) => i.student_id == d.data().student_id);
          if (rec != undefined) {
            d.ref.update({
              present: rec.present,
            });
          }
        });
        alert("successfully updated");
      } else {
        alert(
          "no attendance found on this date\nplease select mark another day's"
        );
      }
    });
  }

  insertAttendance(att: StudentAttendance[], sub: string, date: Date) {
    let col = this.dbCol.collection("attendance");
    let query = col.ref
      .where("date", "==", date.toDateString())
      .where("subject_id", "==", sub);
    console.log(date);
    query.get().then(
      (i) => {
        if (i.size == 0) {
          att.forEach((at) => {
            col.add({
              student_id: at.student_id,
              subject_id: sub,
              present: at.present,
              date: date.toDateString(),
            });
          });
          alert("successfully inserted");
        } else {
          alert("attendance already exist");
        }
      },
      (e) => {
        console.log(e);
      }
    );
  }

  getSubjectsByTeacher(teacher_id: string): EventEmitter<Subject[]> {
    let col = this.dbCol.collection("teacher_subject");
    let query = col.ref.where("teacher_id", "==", teacher_id);
    let subjectIds: string[] = [];
    let subjects: Subject[] = [];
    let subjectsEvent = new EventEmitter<Subject[]>();
    query.get().then(
      (i) => {
        i.forEach((j) => {
          subjectIds.push(j.data().subject_id);
        });
        if (subjectIds.length > 0) {
          let sub_col = this.dbCol.collection("subjects");
          sub_col.snapshotChanges().subscribe(data=>{
            data.forEach(i=>{
              let item_ = i.payload.doc.data() as Subject
              let find = subjectIds.findIndex(j=>j == item_.subject_id )
              if(find!=-1){
                subjects.push({
                  subject_id:item_.subject_id,
                  name:item_.name
                })
              }
            })
            subjectsEvent.emit(subjects)
          })
          /*
          let sub_query = sub_col.ref.where("subject_id", "in", subjectIds);
          sub_query.get().then(
            (i) => {
              i.forEach((j) => {
                subjects.push({
                  subject_id: j.data().subject_id,
                  name: j.data().name,
                });
              });
              subjectsEvent.emit(subjects);
            },
            (e) => console.log(e)
          );
          */

        }
      },
      (e) => console.log(e)
    );
    return subjectsEvent;
  }

  getStudentsByTeacher(teacher_id){
    this.getSubjectsByTeacher(teacher_id).subscribe((subs:Subject[])=>{
      let sub_student = this.dbCol.collection('student_subject')
      let students = this.dbCol.collection('students')
      let student_ids = []
      let students_arr:Student[] = []
      sub_student.snapshotChanges().subscribe(data=>{
        data.forEach(item=>{
          let item_ = item.payload.doc.data() as {student_id:string,subject_id:string}
          let f = subs.findIndex(i=>i.subject_id==item_.subject_id)
          if(f!=-1){
            student_ids.push(item_.student_id)
            
          }
          
        })
        console.log(student_ids)
        students.snapshotChanges().subscribe(studs=>{
          studs.forEach(item=>{
            let item_ = item.payload.doc.data() as Student
            let f = student_ids.findIndex(i=>item_.student_id==i)
            if(f!=-1){
              students_arr.push(item_)
              
            }
            
          })
          this.students_by_teacher_event.emit(students_arr)
        })
      })
    })
  }
  students_by_teacher_event:EventEmitter<Student[]> = new EventEmitter<Student[]>()
  attendance_by_student:EventEmitter<Attendance[]> = new EventEmitter<Attendance[]>()
  getAttendanceByStudent(student_id){
    let att:Attendance[] = []
    let query = this.dbCol.collection('attendance').ref.where('student_id','==',student_id)
    query.get().then(querySnapshot=>{
      querySnapshot.forEach(i=>{
        att.push(i.data() as Attendance)
      })
      this.attendance_by_student.emit(att)
    })


  }
}
