module.exports = class TeamRepository {
  constructor({ ...props }) {
    this.client = new props.src.utils.Cache();
  }

  async get(teamName) {
    return await this.client.get(teamName);
  }

  async create(teamPayload) {
    return await this.client.set(teamPayload?.name, {
      name: teamPayload?.name,
      users: [],
      tasks: [],
    });
  }

  async update(teamPayload) {
    return await this.client.set(teamPayload?.name, {
      name: teamPayload?.name,
      users: teamPayload?.users || [],
      tasks: teamPayload?.tasks || [],
    });
  }
};
