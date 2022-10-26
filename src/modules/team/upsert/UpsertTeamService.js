module.exports = class UpsertTeamService {
  constructor({ ...props }) {
    this.teamRepository = new props.src.modules.team.TeamRepository(props);
    this.registerUserOnTeamService =
      new props.src.modules.user.registerUserOnTeam.RegisterUserOnTeamService(props);
  }

  async execute(teamPayload) {
    const teamFromCache = await this.teamRepository.get(teamPayload?.name);

    if (teamFromCache) {
      await this.registerUserOnTeamService.execute(teamPayload?.name, {
        name: teamPayload?.user,
        joinedAt: new Date(),
      });
      return {
        message: "Cadastro de usuário realizado",
      };
    }

    console.info(`Time ${teamPayload.name} ainda não existe.`);
    await this.teamRepository.create(teamPayload);
    await this.registerUserOnTeamService.execute(teamPayload?.name, {
      name: teamPayload?.user,
      joinedAt: new Date(),
    });
    return {
      message: "Cadastro de usuário e time realizado",
    };
  }
};
