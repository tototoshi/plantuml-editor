root_dir := $(shell pwd)
electron_dir := $(root_dir)/electron-main
electron_renderer_dir := $(root_dir)/electron-renderer
backend_dir := $(root_dir)/backend
protobuf_dir := $(root_dir)/protobuf
bin_path := $(electron_dir)/node_modules/.bin
package_out := $(root_dir)/dist

.PHONY: install gen_js build_main build_renderer build_backend build start
all: build

install:
	cd $(electron_dir) && npm install
	cd $(electron_renderer_dir) && npm install

gen_js:
	curl https://raw.githubusercontent.com/tototoshi/docker-protoc-gen-grpc-web/main/Dockerfile | docker build -t protoc -
	docker run --rm -v $(root_dir):/protoc protoc \
		-I=protobuf/ \
		--js_out=import_style=commonjs,binary:electron-main/src \
		--grpc-web_out=import_style=typescript,mode=grpcweb:electron-main/src \
		protobuf/app.proto

build_main:
	cd $(electron_dir) && npx tsc

build_renderer:
	cd $(electron_renderer_dir) && \
	npx webpack

build_backend:
	cd $(backend_dir) && \
	sbt stage && \
	mkdir -p $(electron_dir)/dist/service && \
	rsync -av $(backend_dir)/target/universal/stage/ $(electron_dir)/dist/service

build: build_main build_renderer build_backend
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
