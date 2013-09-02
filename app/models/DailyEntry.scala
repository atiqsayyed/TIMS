package models

import anorm._
import anorm.SqlParser._
import play.api.db.DB
import play.api.Play.current
import java.util.Date

case class DailyEntry(truckNo: String, source: String, destination: String, bookingDate: String, unloadingDate: String,
  weight: Int, freight: Int, advance: Int, balance: Int, delieveryCharge: Int, detention: Int, commision: Int, hamali: Int, remarks: String,
  ownerFreight: Int, ownerAdvance: Int, ownerBalance: Int, ownerDetention: Int)

case class DailyTruckOwnerEntry(freight: Int, advance: Int, balance: Int, detention: Int)

case class DailyEntryUpdate(entry_id: Int, truckNo: String, source: String, destination: String, bookingDate: java.sql.Date, unloadingDate: java.sql.Date,
  weight: Int, freight: Int, advance: Int, balance: Int, delieveryCharge: Int, detention: Int, commision: Int, hamali: Int, remarks: String,
  ownerFreight: Int, ownerAdvance: Int, ownerBalance: Int, ownerDetention: Int)

object DailyEntry {

  implicit def javaToSqlDate(javaDate: Date) = new java.sql.Date(javaDate.getTime());

  val entry = {
    get[String]("truckNo") ~
      get[String]("source") ~
      get[String]("destination") ~
      get[String]("bookingDate") ~
      get[String]("unloadingDate") ~
      get[Int]("weight") ~
      get[Int]("freight") ~
      get[Int]("advance") ~
      get[Int]("balance") ~
      get[Int]("delieveryCharge") ~
      get[Int]("detention") ~
      get[Int]("commision") ~
      get[Int]("hamali") ~
      get[String]("remarks") ~
      get[Int]("ownerFreight") ~
      get[Int]("ownerAdvance") ~
      get[Int]("ownerBalance") ~
      get[Int]("ownerDetention") map {
        case truckNo ~ source ~ destination ~ bookingDate ~ unloadingDate ~ weight ~ freight ~ advance ~ balance ~ delieveryCharge ~ detention ~
          commision ~ hamali ~ remarks ~ ownerFreight ~ ownerAdvance ~ ownerBalance ~ ownerDetention => {
          DailyEntry(truckNo, source, destination, toyyyymmdd(bookingDate), toyyyymmdd(unloadingDate), weight, freight, advance,
            balance, delieveryCharge, detention, commision, hamali, remarks, ownerFreight, ownerAdvance, ownerBalance, ownerDetention)
        }
      }
  }

  val updateEntry = {
    get[Int]("entry_id") ~
      get[String]("truckNo") ~
      get[String]("source") ~
      get[String]("destination") ~
      get[Date]("bookingDate") ~
      get[Date]("unloadingDate") ~
      get[Int]("weight") ~
      get[Int]("freight") ~
      get[Int]("advance") ~
      get[Int]("balance") ~
      get[Int]("delieveryCharge") ~
      get[Int]("detention") ~
      get[Int]("commision") ~
      get[Int]("hamali") ~
      get[String]("remarks") ~
      get[Int]("ownerFreight") ~
      get[Int]("ownerAdvance") ~
      get[Int]("ownerBalance") ~
      get[Int]("ownerDetention") map {
        case entry_id ~ truckNo ~ source ~ destination ~ bookingDate ~ unloadingDate ~ weight ~ freight ~ advance ~ balance ~ delieveryCharge ~ detention ~
          commision ~ hamali ~ remarks ~ ownerFreight ~ ownerAdvance ~ ownerBalance ~ ownerDetention => {
          DailyEntryUpdate(entry_id, truckNo, source, destination, bookingDate, unloadingDate, weight, freight, advance,
            balance, delieveryCharge, detention, commision, hamali, remarks, ownerFreight, ownerAdvance, ownerBalance, ownerDetention)
        }
      }
  }

  def toyyyymmdd(date: String) = {
    val ddmmyyyy = date.split("-")
    ddmmyyyy(2) + "-" + ddmmyyyy(1) + "-" + ddmmyyyy(0)
  }

  def create(entry: DailyEntry) {

    DB.withConnection { implicit c =>
      SQL("""INSERT INTO dailyEntry ( truckNo, source, destination, bookingDate, unloadingDate, weight, freight,advance, balance, delieveryCharge,detention, commision, hamali, remarks,ownerFreight,ownerAdvance, ownerBalance,ownerDetention) 
          values (  {truckNo}, {source}, {destination}, 
         {bookingDate}, {unloadingDate}, {weight}, {freight}, {advance},
          {balance}, {delieveryCharge}, {detention}, {commision}, {hamali},{remarks}, {ownerFreight},{ownerAdvance}, {ownerBalance},{ownerDetention})""").on(
        'truckNo -> entry.truckNo,
        'source -> entry.source,
        'destination -> entry.destination,
        'bookingDate -> toyyyymmdd(entry.bookingDate),
        'unloadingDate -> toyyyymmdd(entry.unloadingDate),
        'weight -> entry.weight,
        'freight -> entry.freight,
        'advance -> entry.advance,
        'balance -> entry.balance,
        'delieveryCharge -> entry.delieveryCharge,
        'detention -> entry.detention,
        'commision -> entry.commision,
        'hamali -> entry.hamali,
        'remarks -> entry.remarks,
        'ownerFreight -> entry.ownerFreight,
        'ownerAdvance -> entry.ownerAdvance,
        'ownerBalance -> entry.ownerBalance,
        'ownerDetention -> entry.ownerDetention).executeUpdate()
    }
  }

  def delete(id: Int) {
    println("ID to be deleted is " + id)
    DB.withConnection { implicit c =>
      SQL("delete from dailyEntry where entry_id = {id}").on(
        'id -> id).executeUpdate()
    }
  }

  def getEntry(id: Int): List[DailyEntryUpdate] = DB.withConnection { implicit c =>
    SQL("select * from dailyEntry where entry_id =" + id).as(updateEntry *)
  }

  def update(id: Int, entry: DailyEntry) = {
    println("In Update Entry")
    DB.withConnection { implicit connection =>
      SQL(
        """
          update dailyEntry
          set truckNo = {truckNo}, source = {source}, destination = {destination}, bookingDate = {bookingDate}, unloadingDate = {unloadingDate},
          weight = {weight},  freight = {freight}, advance = {advance}, balance = {balance}, delieveryCharge = {delieveryCharge}, detention = {detention},
          commision = {commision},  hamali = {hamali}, remarks = {remarks}, ownerFreight = {ownerFreight}, ownerAdvance = {ownerAdvance},ownerBalance = {ownerBalance},
          ownerDetention = {ownerDetention}
          where entry_id = {id}
        """).on(
          'id -> id,
          'truckNo -> entry.truckNo,
          'source -> entry.source,
          'destination -> entry.destination,
          'bookingDate -> toyyyymmdd(entry.bookingDate),
          'unloadingDate -> toyyyymmdd(entry.unloadingDate),
          'weight -> entry.weight,
          'freight -> entry.freight,
          'advance -> entry.advance,
          'balance -> entry.balance,
          'delieveryCharge -> entry.delieveryCharge,
          'detention -> entry.detention,
          'commision -> entry.commision,
          'hamali -> entry.hamali,
          'remarks -> entry.remarks,
          'ownerFreight -> entry.ownerFreight,
          'ownerAdvance -> entry.ownerAdvance,
          'ownerBalance -> entry.ownerBalance,
          'ownerDetention -> entry.ownerDetention).executeUpdate()
    }
  }

}