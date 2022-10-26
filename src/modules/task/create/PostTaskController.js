module.exports = class PostTaskController {
  constructor(props) {
    this.props = props;
    this.createTaskService =
      new this.props.src.modules.task.create.CreateTaskService(props);
  }
  async execute(request, response) {
    console.info("PostTaskController.execute foi executado");
    const newTask = request.body;
    console.info(newTask);
    const taskId = await this.createTaskService.execute(newTask);
    return response.status(201).json({ taskId });
  }
};
