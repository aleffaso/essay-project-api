export interface EssayCreatedObserver {
  notify(essay: Essay): void;
}

export interface EssayUpdatedObserver {
  notify(essay: Essay): void;
}

export class EmailCreationNotifier implements EssayCreatedObserver {
  notify(essay: Essay): void {
    console.log(`An essay with ID ${essay.id} has been created.`);
  }
}

export class EmailUpdateNotifier implements EssayUpdatedObserver {
  notify(essay: Essay): void {
    console.log(`An essay with ID ${essay.id} has been updated.`);
  }
}
