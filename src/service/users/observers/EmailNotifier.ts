export interface UserCreatedObserver {
  notify(user: User): void;
}

export interface UserUpdatedObserver {
  notify(user: User): void;
}

export class EmailCreationNotifier implements UserCreatedObserver {
  notify(user: User): void {
    console.log(`Welcome aboard ${user.name}`);
  }
}

export class EmailUpdateNotifier implements UserUpdatedObserver {
  notify(user: User): void {
    console.log(`${user.name} your password has been updated`);
  }
}
