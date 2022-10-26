module.exports = class GetTaskByTeamService {
  constructor({ ...props }) {
    this.props = props;
    this.taskRepository =
      new props.src.modules.task.TaskRepository(props);
  }

  async execute(teamName) {
    return await this.taskRepository.get(teamName)
  }
};
