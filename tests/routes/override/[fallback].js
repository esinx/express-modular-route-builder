const get = async (req, res) => {
    res.send({ fallback: true, id: req.params.fallback });
};

module.exports = { get };
