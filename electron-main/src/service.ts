import child_process from "child_process";
import { EventEmitter } from "events";
import { credentials } from "grpc";
import net from "net";
import path from "path";
import services from "./app_grpc_pb";
import messages from "./app_pb";
import AppState from "./app_state";
import { ChildProcessWithoutNullStreams } from "child_process";
import { AddressInfo } from "net";

const waitServer = (port: number): Promise<void> => {
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

const getAvailablePort = (): Promise<number> => {
  return new Promise((resolve) => {
    const server = net.createServer(() => {});
    server.listen(0, () => {
      const addressInfo = server.address() as AddressInfo;
      resolve(addressInfo.port);
      server.close();
    });
  });
};

const stringToBytes = (s: string) => {
  return new TextEncoder().encode(s);
};

export default class extends EventEmitter {
  private port?: number;
  private serverStarted: boolean;
  private service?: ChildProcessWithoutNullStreams;
  private client: any;

  constructor(appState: AppState) {
    super();
    this.serverStarted = false;
    this.client = null;

    appState.on("request-svg", (content) => {
      this.renderPlantUML(content).catch((e) => console.log(e));
    });
  }

  async start() {
    this.port = await getAvailablePort();
    this.client = new services.PreviewerClient(
      "localhost:" + this.port,
      credentials.createInsecure()
    );

    this.service = child_process.spawn(
      path.join(__dirname, "service/bin/service"),
      ["-Djava.awt.headless=true", this.port.toString()]
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

  async renderPlantUML(content: string) {
    if (this.port === undefined) {
      throw new Error("#start is not called");
    }

    if (!this.serverStarted) {
      await waitServer(this.port);
      this.serverStarted = true;
    }

    const request = new (messages as any).PlantUMLRenderingRequest();
    request.setData(stringToBytes(content));
    this.client.renderPlantUML(request, (err: any, response: any) => {
      if (err) {
        console.error(err);
      } else {
        const svg = new TextDecoder("utf-8").decode(response.getData());
        this.emit("svg-rendered", svg);
      }
    });
  }

  stop() {
    if (this.service) {
      this.service.kill();
      this.service = undefined;
    }
  }
}
