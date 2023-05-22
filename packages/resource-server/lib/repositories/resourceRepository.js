class ResourceRepository {
  constructor() {

  }

  async getInstance() {
    if (!ResourceRepository.instance) {
      ResourceRepository.instance = new ResourceRepository();
    }

    return ResourceRepository.instance;
  }
}

module.exports = new ResourceRepository();
