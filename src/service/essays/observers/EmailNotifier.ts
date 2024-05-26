import { Essay } from "../../../entities/essay/Essay";
import { EssayUpdate } from "../../../entities/essay/EssayUpdate";

export interface EssayCreatedObserver {
  notify(essay: Essay): void;
}

export interface EssayUpdatedObserver {
  notify(essay: Essay, essayUpdate: EssayUpdate): void;
}

export class EmailEssayCreationNotifier implements EssayCreatedObserver {
  notify(essay: Essay): void {
    //TODO: implement email notification -> Send to user who will correct this
    console.log(
      `New essay upload ${essay.uploadedLink} status: ${essay.status} author: ${essay.author.email}`
    );
  }
}

export class EmailEssayUpdateNotifier implements EssayUpdatedObserver {
  notify(essay: Essay, essayUpdate: EssayUpdate): void {
    //TODO: implement email notification -> Send to user who has sent the essay
    console.log(
      `Hi ${essay.author}, your essay ${essay.title} was updated by: ${essayUpdate.user.firstName} - status: ${essay.status} `
    );
  }
}
