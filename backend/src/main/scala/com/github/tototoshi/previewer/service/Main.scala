package com.github.tototoshi.previewer.service

import com.github.tototoshi.previewer.app.{PlantUMLRenderingRequest, PlantUMLRenderingResponse, PreviewerGrpc}
import com.google.protobuf.ByteString
import io.grpc.{Server, ServerBuilder}
import net.sourceforge.plantuml.preproc.Defines
import net.sourceforge.plantuml.{FileFormat, FileFormatOption, SourceStringReader}

import java.io.ByteArrayOutputStream
import java.nio.charset.StandardCharsets
import java.util
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
    val config = new util.ArrayList[String]()
    config.add("skinparam monochrome true")
    config.add("skinparam shadowing false")
    val reader = new SourceStringReader(Defines.createEmpty(), request.data.toString(StandardCharsets.UTF_8), config)
    val os = new ByteArrayOutputStream()
    reader.outputImage(os, new FileFormatOption(FileFormat.SVG))
    Future.successful(PlantUMLRenderingResponse(data = ByteString.copyFrom(os.toByteArray)))
  }

}