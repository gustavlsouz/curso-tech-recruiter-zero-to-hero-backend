module.exports = class RegisterUserOnTeamService {
  constructor({ ...props }) {
    this.userRepository = new props.src.modules.user.UserRepository(props);
  }
  async execute(teamName, user) {
    return await this.userRepository.registerOnTeam(teamName, user);
  }
};
