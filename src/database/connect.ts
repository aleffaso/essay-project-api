import { AppDataSource } from "../data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized");
  })
  .catch((error: any) => {
    console.log("Error during Data Source initialization: ", error);
  });

export { AppDataSource };
