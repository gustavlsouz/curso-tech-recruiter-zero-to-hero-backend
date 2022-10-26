module.exports = class UserRepository {
  constructor({ ...props }) {
    this.client = new props.src.utils.Cache();
  }

  async registerOnTeam(teamName, user) {
    const teamFromCache = await this.client.get(teamName);
    teamFromCache.users.push({
      ...user,
    });
    await this.client.set(teamName, teamFromCache);
    return;
  }
};
