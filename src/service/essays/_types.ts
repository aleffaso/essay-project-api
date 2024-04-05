type Essay = {
  id?: string;
  title: string;
  author: string;
  text: string;
  amazonLink?: string;
  annotations?: string;
  status?: string;
  corrections?: string;
  tags?: string;
  comments?: string;
};

type EssayResponse = Essay;

type EssayUpdate = {
  id: Essay["id"];
  annotations?: Essay["annotations"];
  status?: Essay["status"];
  corrections?: Essay["corrections"];
  tags?: Essay["tags"];
  comments?: Essay["comments"];
};

type EssayId = {
  id: Essay["id"];
};
