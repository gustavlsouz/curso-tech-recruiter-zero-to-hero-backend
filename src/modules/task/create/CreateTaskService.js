module.exports = class CreateTaskService {
  constructor({ ...props }) {
    this.props = props;
    this.taskRepository = new props.src.modules.task.TaskRepository(props);
    this.upsertTeamService =
      new props.src.modules.team.upsert.UpsertTeamService(props);
  }

  async execute(task) {
    await this.upsertTeamService.execute({
      name: task.teamName,
      user: task.userName,
    });
    return await this.taskRepository.create(task);
  }
};
