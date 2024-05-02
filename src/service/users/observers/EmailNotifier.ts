import { User } from "../../../entities/user/User";

export interface UserCreatedObserver {
  notify(user: User): void;
}

export interface UserUpdatedObserver {
  notify(user: User): void;
}

export class EmailCreationNotifier implements UserCreatedObserver {
  notify(user: User): void {
    //TODO: implement email notification
    console.log(`Welcome aboard ${user.firstName}`);
  }
}

export class EmailUpdateNotifier implements UserUpdatedObserver {
  notify(user: User): void {
    //TODO: implement email notification
    console.log(`${user.firstName} your password has been updated`);
  }
}
