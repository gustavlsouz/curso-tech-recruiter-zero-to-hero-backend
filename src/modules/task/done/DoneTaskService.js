module.exports = class DoneTaskService {
  constructor({ ...props }) {
    this.taskRepository = new props.src.modules.task.TaskRepository(props);
  }
  async execute(donePayload) {
    await this.taskRepository.done(donePayload);
    return { message: "Tarefa finalizada" };
  }
};
