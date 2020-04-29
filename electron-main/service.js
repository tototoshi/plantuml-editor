"use strict";

const child_process = require("child_process");
const path = require("path");
const grpc = require("grpc");
const net = require("net");
const services = require("./proto/app_grpc_pb");
const messages = require("./proto/app_pb");

const waitServer = (port) => {
  return new Promise((resolve) => {
    const tryConnect = () => {
      const socket = new net.Socket();
      socket.connect({ port: port });
      socket.on("error", () => {
        setTimeout(() => {
          tryConnect();
        }, 100);
      });
      socket.on("connect", () => {
        resolve();
      });
    };
    tryConnect();
  });
};

const getAvailablePort = () => {
  return new Promise((resolve) => {
    const server = net.createServer(() => {});
    server.listen(0, () => {
      resolve(server.address().port);
      server.close();
    });
  });
};

const stringToBytes = (s) => {
  return new TextEncoder("utf-8").encode(s);
};

module.exports = class {
  constructor() {
    this.serverStarted = false;
    this.client = null;
    this.service = null;
  }

  async start() {
    this.port = await getAvailablePort();
    this.client = new services.PreviewerClient(
      "localhost:" + this.port,
      grpc.credentials.createInsecure()
    );

    this.service = child_process.spawn(
      path.join(__dirname, "service/bin/service"),
      [this.port]
    );

    this.service.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    this.service.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    this.service.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

  async renderPlantUML(content) {
    if (!this.serverStarted) {
      await waitServer(this.port);
      this.serverStarted = true;
    }

    return new Promise((resolve, reject) => {
      const request = new messages.PlantUMLRenderingRequest();
      request.setData(stringToBytes(content));

      this.client.renderPlantUML(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.getData());
        }
      });
    });
  }

  stop() {
    if (this.service) {
      this.service.kill();
      this.service = null;
    }
  }
};
