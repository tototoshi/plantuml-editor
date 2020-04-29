"use strict";

const { EventEmitter } = require("events");

module.exports = class extends EventEmitter {
  constructor() {
    super();
    this.filePath = null;
    this.content = null;
    this.flash = null;
  }

  get() {
    return {
      filePath: this.filePath,
      content: this.content,
      flash: this.flash,
    };
  }

  async update(state) {
    if (this.flash) {
      this.flash = null;
      this.emit("flash-set", this.flash);
    }

    if (typeof state.flash !== "undefined") {
      this.flash = state.flash;
      this.emit("flash-set", this.flash);
    }

    if (typeof state.filePath !== "undefined") {
      this.filePath = state.filePath;
      this.emit("file-path-updated", this.filePath);
    }

    if (typeof state.content !== "undefined") {
      this.content = state.content;
      this.emit("content-updated", this.content);
    }
  }
};
