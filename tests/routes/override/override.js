const get = async (req, res) => {
    res.send({ override: true });
};

module.exports = { get };
