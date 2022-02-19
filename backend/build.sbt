lazy val root = project.in(file("."))
  .enablePlugins(JavaAppPackaging)
  .settings(
    name := "service",
    organization := "com.github.tototoshi",
    version := "0.1.0-SNAPSHOT",
    scalaVersion := "2.13.8",
    libraryDependencies ++= Seq(
      "net.sourceforge.plantuml" % "plantuml" % "1.2022.1",
      "io.grpc" % "grpc-core" % "1.44.1",
      "io.grpc" % "grpc-stub" % "1.44.1",
      "io.grpc" % "grpc-protobuf" % "1.44.1",
      "io.grpc" % "grpc-netty" % "1.44.1" % Runtime,
      "com.thesamet.scalapb" %% "scalapb-runtime-grpc" % scalapb.compiler.Version.scalapbVersion
    ),
    mappings in (Compile, packageDoc) := Seq(),
    Compile / PB.targets := Seq(
      scalapb.gen() -> (Compile / sourceManaged).value / "scalapb"
    ),
    Compile / PB.protoSources += (Compile / baseDirectory).value / ".." / "protobuf"
  )
