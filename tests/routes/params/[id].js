const get = async (req, res) => {
    res.send({ ...req.params });
};

module.exports = { get };
