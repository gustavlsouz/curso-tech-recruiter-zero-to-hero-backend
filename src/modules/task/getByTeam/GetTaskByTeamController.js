module.exports = class GetTaskByTeamController {
  constructor(props) {
    this.props = props;
    this.getTaskByTeamService =
      new this.props.src.modules.task.getByTeam.GetTaskByTeamService(props);
  }
  async execute(request, response) {
    const teamName = request.query?.team;
    const tasks = await this.getTaskByTeamService.execute(teamName);
    return response.status(200).json(tasks);
  }
};
