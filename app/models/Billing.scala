package models

import anorm._
import anorm.SqlParser._
import play.api.db.DB
import play.api.Play.current
import java.util.Date
import java.text.SimpleDateFormat

case class Billing(entry_id:Int, bookingDate: java.sql.Date, source: String, destination: String, freight: Int, advance: Int, commision: Int, hamali: Int)

object Billing {

  implicit def javaToSqlDate(javaDate: Date) = new java.sql.Date(javaDate.getTime());

  val bill = {
    get[Int]("entry_id") ~
    get[Date]("bookingDate") ~
      get[String]("source") ~
      get[String]("destination") ~
      get[Int]("freight") ~
      get[Int]("advance") ~
      get[Int]("commision") ~
      get[Int]("hamali") map {
        case entry_id~bookingDate ~ source ~ destination ~ freight ~ advance ~ commision ~ hamali => {
          Billing(entry_id,bookingDate, source, destination, freight, advance, commision, hamali)
        }
      }
  }

  def generateBill(truckNo: String, startDate: String, endDate: String): List[Billing] = DB.withConnection { implicit c =>
    SQL("select * from dailyEntry where truckNo = \"" + truckNo + "\" and bookingDate between \'" +startDate + "\'and \'" + endDate + "\'").as(bill *)
  }

}