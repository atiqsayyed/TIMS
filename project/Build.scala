import sbt._
import Keys._
import play.Project._
import com.github.play2war.plugin._

object ApplicationBuild extends Build {

  val appName         = "TIMS"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    "mysql" % "mysql-connector-java" % "5.1.18",
    jdbc,
    anorm
  )


  val main = play.Project(appName, appVersion, appDependencies).settings(Play2WarPlugin.play2WarSettings: _*).settings( Play2WarKeys.servletVersion := "3.0")

}
