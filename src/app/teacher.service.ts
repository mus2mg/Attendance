import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private current_teacher_id:string = 't8898'
  public teacherEvent:EventEmitter<string> = new EventEmitter<string>()
  constructor() { }

  public getTeacher(){
    this.teacherEvent.emit(this.current_teacher_id)
  }
  
}
