lazy val protobuf = project.in(file("protobuf"))
  .settings(
    name := "protobuf",
    organization := "com.github.tototoshi",
    version := "0.1.0-SNAPSHOT",
    scalaVersion := "2.13.1",
    libraryDependencies ++= Seq(
      "com.google.protobuf" % "protobuf-java" % "3.11.4",
      "io.grpc" % "grpc-core" % "1.29.0",
      "io.grpc" % "grpc-stub" % "1.29.0",
      "io.grpc" % "grpc-protobuf" % "1.29.0"
    )
  )

lazy val service = project.in(file("service"))
  .enablePlugins(JavaAppPackaging)
  .settings(
    name := "service",
    organization := "com.github.tototoshi",
    version := "0.1.0-SNAPSHOT",
    scalaVersion := "2.13.1",
    libraryDependencies ++= Seq(
      "net.sourceforge.plantuml" % "plantuml" % "1.2021.1",
      "io.grpc" % "grpc-netty" % "1.35.0" % Runtime
    ),
    mappings in (Compile, packageDoc) := Seq()
  )
  .dependsOn(protobuf)

lazy val root = project.in(file("."))
  .aggregate(service)
