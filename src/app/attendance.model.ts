export interface Attendance{
    date:Date,
    student_id:string,
    subject_id:string,
    present:boolean
}

export interface Subject{
    subject_id:string,
    name:string
}
export interface Student{
    email:string,
    student_id:string,
    student_name:string,
    roll_no:number
}
export interface StudentAttendance{
    student_id:string,
    student_name:string,
    present:boolean
}
export interface Report{
    date:Date[],
    student_id:string,
    student_name:string,
    subject_id:string,
    present:boolean[],

}