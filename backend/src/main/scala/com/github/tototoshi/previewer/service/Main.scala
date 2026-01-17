package com.github.tototoshi.previewer.service

import com.github.tototoshi.previewer.app.{PlantUMLRenderingRequest, PlantUMLRenderingResponse, PreviewerGrpc}
import com.google.protobuf.ByteString
import io.grpc.{Server, ServerBuilder}
import net.sourceforge.plantuml.{FileFormat, FileFormatOption, SourceStringReader}

import java.io.ByteArrayOutputStream
import java.nio.charset.StandardCharsets
import scala.concurrent.{ExecutionContext, Future}


object Main {

  def main(args: Array[String]): Unit = {
    val port = args(0).toInt
    val builder = ServerBuilder.forPort(port)
    val executionContext = ExecutionContext.global
    val server = builder.addService(PreviewerGrpc.bindService(new PreviewerService, executionContext)).build()
    server.start()
    server.awaitTermination()
  }

}

class PreviewerService extends PreviewerGrpc.Previewer {

  override def renderPlantUML(request: PlantUMLRenderingRequest): Future[PlantUMLRenderingResponse] = {
    val reader = new SourceStringReader(request.data.toString(StandardCharsets.UTF_8))
    val os = new ByteArrayOutputStream()
    reader.generateImage(os, new FileFormatOption(FileFormat.SVG))
    Future.successful(PlantUMLRenderingResponse(data = ByteString.copyFrom(os.toByteArray)))
  }

}