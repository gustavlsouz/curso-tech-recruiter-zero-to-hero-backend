const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();

const console = require("./src/utils/logger");
global.console = console;

const src = require("./src");

const PORT = 3000;

function init() {
  if (!fs.existsSync("./logs")) {
    fs.mkdirSync("logs");
  }
}

function bootstrap() {
  init();
  new src.utils.Cache().setLogger(console);

  app.use(cors());
  app.use(express.json());

  app.use((request, _, next) => {
    console.info();
    console.info("Uma nova requisição foi realidaza no backend!!");
    console.info(new Date());
    console.info(`requisição do usuário ${request.headers["x-user-name"]}`);
    console.info(request.url);
    // console.info(JSON.stringify(request.headers));
    console.info(JSON.stringify(request.body));
    return next();
  });

  app.get("/hello", (_request, response) =>
    response.send("Hello, Tech Recruiter!")
  );

  const createController = src.utils.createController;

  app.post(
    "/task",
    createController(src, src.modules.task.create.PostTaskController)
  );

  app.get(
    "/task",
    createController(src, src.modules.task.getByTeam.GetTaskByTeamController)
  );

  app.patch(
    "/task/done",
    createController(src, src.modules.task.done.DoneTaskController)
  );

  app.patch(
    "/team",
    createController(src, src.modules.team.upsert.PatchTeamController)
  );

  app.listen(PORT, () => {
    console.info(`Backend escutando porta ${PORT}`);
  });
}

bootstrap();
