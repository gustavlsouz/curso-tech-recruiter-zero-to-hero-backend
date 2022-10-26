module.exports = function createController(src, controllerClass) {
  const instance = new controllerClass({ src });
  return async function controller(request, response) {
    try {
      console.info(`executing ${controllerClass?.name}`);
      return await instance.execute(request, response);
    } catch (error) {
      response.status(500).json({ message: error?.message });
      console.error(error);
    }
  };
};
