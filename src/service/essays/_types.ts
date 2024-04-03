type Essay = {
  id?: string;
  title: string;
  author: string;
  text: string;
  uploadDate: Date;
  amazonLink?: string;
  annotations?: string;
  status?: string;
  corrections?: string;
  tags?: string;
  comments?: string;
};

type essayResponse = Essay;

type essayUpdate = {
  id: Essay["id"];
  annotations?: Essay["annotations"];
  status?: Essay["status"];
  corrections?: Essay["corrections"];
  tags?: Essay["tags"];
  comments?: Essay["comments"];
};
