package com.github.tototoshi.previewer.service

import java.io.ByteArrayOutputStream
import java.nio.charset.StandardCharsets
import java.util

import com.github.tototoshi.previewer.App.PlantUMLRenderingResponse
import com.github.tototoshi.previewer.{App, PreviewerGrpc}
import com.google.protobuf.ByteString
import io.grpc.stub.StreamObserver
import io.grpc.{Server, ServerBuilder}
import net.sourceforge.plantuml.preproc.Defines
import net.sourceforge.plantuml.{FileFormat, FileFormatOption, SourceStringReader}


object Main {

  def main(args: Array[String]): Unit = {
    val port = args(0).toInt
    val builder = ServerBuilder.forPort(port)
    val server: Server = builder.addService(new PreviewerService).build()
    server.start()
    server.awaitTermination()
  }

}

class PreviewerService extends PreviewerGrpc.PreviewerImplBase {

  override def renderPlantUML(request: App.PlantUMLRenderingRequest, responseObserver: StreamObserver[App.PlantUMLRenderingResponse]): Unit = {
    val config = new util.ArrayList[String]()
    config.add("skinparam monochrome true")
    config.add("skinparam shadowing false")
    val reader = new SourceStringReader(Defines.createEmpty(), request.getData.toString(StandardCharsets.UTF_8), config)
    val os = new ByteArrayOutputStream()
    reader.outputImage(os, new FileFormatOption(FileFormat.SVG))
    val response = PlantUMLRenderingResponse.newBuilder()
        .setData(ByteString.copyFrom(os.toByteArray))
        .build()
        responseObserver.onNext(response)
    responseObserver.onCompleted()
  }

}