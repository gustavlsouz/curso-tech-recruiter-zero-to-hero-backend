module.exports = class DoneTaskController {
  constructor({ ...props }) {
    this.doneTaskService = new props.src.modules.task.done.DoneTaskService(
      props
    );
  }
  async execute(request, response) {
    console.info("DoneTaskController.execute");
    const donePayload = request.body;
    const result = await this.doneTaskService.execute(donePayload);
    return response.json(result);
  }
};
