package models

import anorm._
import anorm.SqlParser._
import play.api.db.DB
import play.api.Play.current
import java.util.Date
import java.text.SimpleDateFormat

case class TruckDetail(truckNo: String, driver: String, owner: String, insuranceNo: String)
case class Number(truckNo: String)

object TruckDetail {
  val truckDetail = {
    get[String]("truckNo") ~
      get[String]("driver") ~
      get[String]("owner") ~
      get[String]("insuranceNo") map {
        case truckNo ~ driver ~ owner ~ insuranceNo => {
          TruckDetail(truckNo, driver, owner, insuranceNo)
        }
      }
  }

  val truckNo = {
    get[String]("truckNo") map {
      case truckNo => Number(truckNo)
    }
  }

  def getTruckDetails(): List[TruckDetail] = DB.withConnection { implicit c =>
    SQL("select * from truckDetails").as(truckDetail *)
  }
  
  def getTruckDetail(truckNo:String) = DB.withConnection{ implicit c =>
    SQL("select * from truckDetails where truckNo=\""+truckNo+"\"").as(truckDetail single)
    
  }

  def getTruckNos(): List[Number] = DB.withConnection { implicit c =>
    SQL("select truckNo from truckDetails").as(truckNo *)
  }

  def createTruck(truck: TruckDetail) = {
    DB.withConnection { implicit c =>
      SQL("INSERT INTO truckDetails ( truckNo,driver, owner,insuranceNo ) values (  {truckNo}, {driver}, {owner}, {insuranceNo})").on(
        'truckNo -> truck.truckNo,
        'driver -> truck.driver,
        'owner -> truck.owner,
        'insuranceNo -> truck.insuranceNo).executeUpdate()
    }
  }

  def deleteTruck(truckNo: String) = {
    DB.withConnection { implicit c =>
      SQL("delete from truckDetails where truckNo = {truckNo}").on(
        'truckNo -> truckNo).executeUpdate()
    }
  }

  def updateTruck(truckNo: String, truck: TruckDetail) = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update truckDetails
          set truckNo = {truckNo}, driver = {driver}, owner = {owner}, insuranceNo = {insuranceNo}
          where truckNo = {truckNo}
        """).on(
          'truckNo -> truckNo,
          'driver -> truck.driver,
          'owner -> truck.owner,
          'insuranceNo -> truck.insuranceNo).executeUpdate()
    }
  }
}