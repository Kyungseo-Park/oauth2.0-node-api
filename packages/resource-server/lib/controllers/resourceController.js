const ResourceService = require('../services/resourceService');


class ResourceController {
    constructor() {
        this.resourceService = ResourceService.getInstance();
    }

    getInstance() {
        if (!ResourceController.instance) {
            ResourceController.instance = new ResourceController();
        }

        return ResourceController.instance;
    }

    getResource(req, res) {
        const { authorization } = req.headers;

        res.json({
            name: 'name',
            email: 'email',
            picture: 'picture',
        });
    }
}

module.exports = new ResourceController();
