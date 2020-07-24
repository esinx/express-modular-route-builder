const path = require("path");
const express = require("express");
const axios = require("axios");

const buildRoutes = require("../build");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

const getRandomPort = (from = 5000, to = 10000) => Math.floor(Math.random() * (to - from)) + from;

const app = express();
const port = getRandomPort();
let server;

describe("Initialization", () => {
    it("initializes without error", async () => {
        const routes = buildRoutes(path.resolve(__dirname, "./routes"));
        app.use("/", (req, res, next) => routes(req, res, next));
        server = await app.listen(port);
    });
});

describe("Paths", () => {
    describe("Static Paths", async () => {
        it("serves static path", async () => {
            const res = await axios.get(`http://localhost:${port}/test`);
            res.data.should.not.equal(null);
            res.data.success.should.equal(true);
        });
        it("serves nested static path", async () => {
            const res = await axios.get(`http://localhost:${port}/nested/test`);
            res.data.should.not.equal(null);
            res.data.success.should.equal(true);
        });
        it("serves double-nested static path", async () => {
            const res = await axios.get(`http://localhost:${port}/double/nested/test`);
            res.data.should.not.equal(null);
            res.data.success.should.equal(true);
        });
    });
    describe("Dynamic Paths", async () => {
        it("recognizes parameters", async () => {
            const id = String(Math.floor(Math.random() * 1000));
            const res = await axios.get(`http://localhost:${port}/params/${id}`);
            res.data.should.not.equal(null);
            res.data.id.should.equal(id);
        });
        it("recognizes nested parameters", async () => {
            const id_1 = String(Math.floor(Math.random() * 1000));
            const id_2 = String(Math.floor(Math.random() * 1000));
            const res = await axios.get(`http://localhost:${port}/params/${id_1}/${id_2}`);
            res.data.should.not.equal(null);
            res.data.id_1.should.equal(id_1);
            res.data.id_2.should.equal(id_2);
        });
    });
    describe("Overrided Paths", async () => {
        it("follows priority", async () => {
            const res = await axios.get(`http://localhost:${port}/override/override`);
            res.data.should.not.equal(null);
            res.data.override.should.equal(true);
        });
        it("follows fallback", async () => {
            const id = String(Math.floor(Math.random() * 1000));
            const res = await axios.get(`http://localhost:${port}/override/${id} `);
            res.data.should.not.equal(null);
            res.data.id.should.equal(id);
            res.data.fallback.should.equal(true);
        });
    });
});

describe("Methods", () => {
    const methods = ["GET", "POST", "DELETE"];
    describe("Static paths", async () => {
        it("invokes corresponding methods", async () => {
            for (const method of methods) {
                const res = await axios.request(`http://localhost:${port}/methods`, {
                    method,
                });
                res.data.should.not.equal(null);
                res.data.method.should.equal(method);
            }
        });
    });
    describe("Dynamic paths", async () => {
        it("invokes corresponding methods", async () => {
            for (const method of methods) {
                const id = String(Math.floor(Math.random() * 1000));
                const res = await axios.request(`http://localhost:${port}/methods/${id}`, {
                    method,
                });
                res.data.should.not.equal(null);
                res.data.id.should.equal(id);
                res.data.method.should.equal(method);
            }
        });
    });
});

after(() => {
    server.close();
});
