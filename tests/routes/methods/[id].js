const get = async function (req, res) {
    return res.send({ id: req.params.id, method: "GET" });
};
const post = async function (req, res) {
    return res.send({ id: req.params.id, method: "POST" });
};
const del = async function (req, res) {
    return res.send({ id: req.params.id, method: "DELETE" });
};

module.exports = {
    get,
    post,
    delete: del,
};
