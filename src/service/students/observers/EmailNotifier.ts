export interface StudentCreatedObserver {
  notify(student: Student): void;
}

export interface StudentUpdatedObserver {
  notify(student: Student): void;
}

export class EmailCreationNotifier implements StudentCreatedObserver {
  notify(student: Student): void {
    console.log(`Welcome aboard ${student.firstName}`);
  }
}

export class EmailUpdateNotifier implements StudentUpdatedObserver {
  notify(student: Student): void {
    console.log(`${student.firstName} your password has been updated`);
  }
}
