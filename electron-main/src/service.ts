import child_process from "child_process";
import { EventEmitter } from "events";
import { credentials } from "@grpc/grpc-js";
import net from "net";
import path from "path";
import { PreviewerClient } from "./generated/app_grpc_pb";
import { PlantUMLRenderingRequest} from "./generated/app_pb";
import AppState from "./app_state";
import { ChildProcessWithoutNullStreams } from "child_process";
import { AddressInfo } from "net";
import fs from "fs";
import { PreviewerClientWrapper } from './previewerClientWrapper';

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
  private client?: PreviewerClientWrapper;

  constructor(appState: AppState) {
    super();
    this.serverStarted = false;

    appState.on("request-svg", (content) => {
      this.renderPlantUML(content)
        .then((svg) => this.emit("svg-rendered", this.decodeBuffer(svg)))
        .catch((e) => console.log(e));
    });

    appState.on("export-svg", ({ filePath, content }) => {
      this.renderPlantUML(content)
        .then((svg) => fs.writeFileSync(filePath, svg))
        .catch((e) => console.log(e));
    });
  }

  async start() {
    this.port = await getAvailablePort();
    this.client = new PreviewerClientWrapper(new PreviewerClient(
      "localhost:" + this.port,
      credentials.createInsecure()
    ));

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

  async renderPlantUML(content: string): Promise<Buffer> {
    if (this.port === undefined || this.client === undefined) {
      throw new Error("#start is not called");
    }

    if (!this.serverStarted) {
      await waitServer(this.port);
      this.serverStarted = true;
    }

    const request = new PlantUMLRenderingRequest();
    request.setData(stringToBytes(content));

    const response = await this.client.renderPlantUML(request);

    return Buffer.from(response.getData());
  }

  decodeBuffer(buffer: Buffer): string {
    return new TextDecoder("utf-8").decode(buffer);
  }

  stop() {
    if (this.service) {
      this.service.kill();
      this.service = undefined;
    }
  }
}
