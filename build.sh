#!/bin/bash

set -eux

cd $(dirname $0)

protobuf_include=$(pwd)/protobuf
protobuf_source=$protobuf_include/app.proto

npm_install() {
    local electron_dir=$(pwd)/electron-main
    local electron_renderer_dir=$(pwd)/electron-renderer

    (cd $electron_dir && npm install) &
    (cd $electron_renderer_dir && npm install) &
    wait
}

gen_js() {
    local electron_dir=$(pwd)/electron-main
    local bin_path=$electron_dir/node_modules/.bin
    local src_dir=$electron_dir/src

    mkdir -p $src_dir
    $bin_path/grpc_tools_node_protoc \
        -I $protobuf_include \
        --js_out=import_style=commonjs,binary:$src_dir \
        --grpc_out=$src_dir \
        --plugin=protoc-gen-grpc=$bin_path/grpc_tools_node_protoc_plugin \
        $protobuf_source
}

build_backend() {
    local backend_dir=$(pwd)/backend
    local electron_dir=$(pwd)/electron-main

    pushd $backend_dir
    sbt clean stage
    popd
    mkdir -p $electron_dir/dist/service
    rsync -av $backend_dir/target/universal/stage/ $electron_dir/dist/service
}

build_main() {
    local electron_dir=$(pwd)/electron-main

    pushd $electron_dir
    npm run build
    popd
}

build_renderer() {
    local electron_renderer_dir=$(pwd)/electron-renderer

    pushd $electron_renderer_dir
    npm run webpack
    popd
}

npm_install
gen_js
build_main &
build_backend &
build_renderer &
wait
