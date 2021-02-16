root_dir := $(shell pwd)
electron_dir := $(root_dir)/electron-main
electron_renderer_dir := $(root_dir)/electron-renderer
backend_dir := $(root_dir)/backend
protobuf_dir := $(root_dir)/protobuf
bin_path := $(electron_dir)/node_modules/.bin

.PHONY: install gen_js build_main build_renderer build_backend build start
all: install gen_js build_main build_renderer build_backend build

install:
	cd $(electron_dir) && npm install
	cd $(electron_renderer_dir) && npm install

gen_js:
	mkdir -p $(electron_dir)/src
	$(bin_path)/grpc_tools_node_protoc \
	-I $(protobuf_dir) \
	--js_out=import_style=commonjs,binary:$(electron_dir)/src \
	--grpc_out=$(electron_dir)/src \
	--plugin=protoc-gen-grpc=$(bin_path)/grpc_tools_node_protoc_plugin \
	$(protobuf_dir)/app.proto

build_main:
	cd $(electron_dir) && npx tsc

build_renderer:
	cd $(electron_renderer_dir) && \
	npx webpack

build_backend:
	cd $(backend_dir) && \
	sbt clean stage && \
	mkdir -p $(electron_dir)/dist/service && \
	rsync -av $(backend_dir)/target/universal/stage/ $(electron_dir)/dist/service

build: build_main build_renderer build_backend
	cd $(electron_dir) && \
	npx electron-packager . "PlantUML Editor" --platform=darwin --overwrite --arch=x64

start:
	cd $(electron_dir) && npx electron .
