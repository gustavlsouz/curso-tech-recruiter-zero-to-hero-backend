const uuid = require("uuid");

module.exports = class TaskRepository {
  constructor({ ...props }) {
    this.client = new props.src.utils.Cache();
    this.teamRepository = new props.src.modules.team.TeamRepository(props);
  }

  async create(task) {
    const taskData = {
      ...task,
      id: uuid.v4(),
      createdAt: new Date(),
    };
    const teamData = await this.client.get(task?.teamName);
    const ok = Array.isArray(teamData?.tasks);
    if (!ok) {
      throw new Error("Este time não existe");
    }
    teamData.tasks.unshift(taskData);
    await this.client.set(task?.teamName, teamData);
    return taskData.id;
  }

  async get(teamName) {
    return (await this.client.get(teamName))?.tasks || [];
  }

  async done(donePayload) {
    const tasks = await this.get(donePayload.teamName);
    const task = tasks.find((task) => task?.id === donePayload.taskId);
    if (!task) {
      throw new Error("Tarefa não encontrada");
    }
    task.doneBy = donePayload.userName;
    await this.update(donePayload.teamName, task);
    return true;
  }

  async update(teamName, task) {
    const teamData = await this.teamRepository.get(teamName);
    const taskIndex = teamData.tasks.findIndex(
      (taskItem) => taskItem?.id === task?.id
    );
    teamData.tasks[taskIndex] = { ...task };
    await this.teamRepository.update(teamData);
  }
};
