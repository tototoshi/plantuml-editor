root_dir := $(shell pwd)
electron_dir := $(root_dir)/electron-main
electron_renderer_dir := $(root_dir)/electron-renderer
backend_dir := $(root_dir)/backend
protobuf_dir := $(root_dir)/protobuf
bin_path := $(electron_dir)/node_modules/.bin
package_out := $(root_dir)/dist

electron_npm_bin := $(electron_dir)/node_modules/.bin
grpc_tools_node_protoc := $(electron_npm_bin)/grpc_tools_node_protoc
grpc_tools_node_protoc_plugin := $(electron_npm_bin)/grpc_tools_node_protoc_plugin
protoc-gen-ts := $(electron_npm_bin)/protoc-gen-ts
protobuf_out := $(electron_dir)/src/generated

.PHONY: install gen_protobuf build_main build_renderer build_backend build start
all: build

install:
	cd $(electron_dir) && npm install
	cd $(electron_renderer_dir) && npm install

gen_protobuf:
	mkdir -p $(protobuf_out)
	$(grpc_tools_node_protoc) \
		--js_out=import_style=commonjs,binary:$(protobuf_out) \
		--grpc_out=grpc_js:$(protobuf_out) \
		--plugin=protoc-gen-grpc=$(grpc_tools_node_protoc_plugin) \
		-I protobuf \
		protobuf/*.proto
	$(grpc_tools_node_protoc) \
		--plugin=protoc-gen-ts=$(protoc-gen-ts) \
		--ts_out=$(protobuf_out) \
		-I protobuf \
		protobuf/*.proto

build_main: gen_protobuf
	cd $(electron_dir) && npx tsc

build_renderer:
	cd $(electron_renderer_dir) && \
	npx webpack

build_backend:
	cd $(backend_dir) && \
	sbt stage && \
	mkdir -p $(electron_dir)/dist/service && \
	rsync -av $(backend_dir)/target/universal/stage/ $(electron_dir)/dist/service

build: install build_main build_renderer build_backend
	cd $(electron_dir) && \
	npx electron-packager . "PlantUML Editor" \
		--platform=darwin \
		--overwrite \
		--arch=x64 \
		--out=$(package_out)

clean:
	rm -rf dist
	cd $(electron_dir) && \
	rm -rf dist
	cd $(backend_dir) && \
	sbt clean

start:
	cd $(electron_dir) && npx electron .
