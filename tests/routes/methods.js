const get = async function (req, res) {
    return res.send({ method: "GET" });
};
const post = async function (req, res) {
    return res.send({ method: "POST" });
};
const del = async function (req, res) {
    return res.send({ method: "DELETE" });
};

module.exports = {
    get,
    post,
    delete: del,
};
