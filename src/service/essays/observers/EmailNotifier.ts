import { Essay } from "../../../entities/essay/Essay";
import { User } from "../../../entities/user/User";

export interface EssayCreatedObserver {
  notify(essay: Essay): void;
}

export interface EssayUpdatedObserver {
  notify(essay: Essay, user: User): void;
}

export class EmailEssayCreationNotifier implements EssayCreatedObserver {
  notify(essay: Essay): void {
    //TODO: implement email notification -> Send to user who will correct this
    console.log(
      `New essay uploaded ${essay.uploadedLink} status: ${essay.status} author: ${essay.author.email}`
    );
  }
}

export class EmailEssayUpdateNotifier implements EssayUpdatedObserver {
  notify(essay: Essay, user: User): void {
    //TODO: implement email notification -> Send to user who has sent the essay
    console.log(
      `Hi ${essay.author.firstName}, your essay "${essay.title}" was updated by: ${user.firstName} - status: ${essay.status} `
    );
  }
}
