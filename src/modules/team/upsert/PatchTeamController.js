module.exports = class PatchTeamController {
  constructor({ ...props }) {
    this.upsertTeamService =
      new props.src.modules.team.upsert.UpsertTeamService(props);
  }
  async execute(request, response) {
    console.info("PatchTeamController.execute foi executado");
    const teamPayload = request.body;
    const result = await this.upsertTeamService.execute(teamPayload);
    return response.json(result);
  }
};
