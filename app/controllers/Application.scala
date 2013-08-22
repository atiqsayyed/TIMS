package controllers

import models.Billing
import models.DailyEntry
import play.api.data.Form
import play.api.data.Forms.mapping
import play.api.data.Forms.nonEmptyText
import play.api.data.Forms.number
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.json.Json
import play.api.mvc.Action
import play.api.mvc.Controller
import models.DailyEntryUpdate

object Application extends Controller {

  def index = Action {
    //   Redirect(routes.Application.newEntry)
    //    Ok(views.html.dailyEntry(entryForm))

    Ok(views.html.Dashboard())
  }

  
  def billing = Action {
    Ok(views.html.billing())
  }

  def entries = Action {
    //    Ok(views.html.index(DailyEntry.all(), entryForm))
    Ok(views.html.dailyEntry(entryForm))
  }

  def generateBill(truckNo: String, startDate: String, endDate: String) = Action {
    implicit val billingWrites = Json.writes[Billing]
    val bills = Billing.generateBill(truckNo, startDate, endDate)
    Ok(Json.toJson(bills))
  }
  
  def getEntry(id:Int) = Action {
    implicit val entryWrites = Json.writes[DailyEntryUpdate]
    val entry = DailyEntry.getEntry(id)
    Ok(Json.toJson(entry))
  }  

  def newEntry = Action { implicit request =>
    entryForm.bindFromRequest.fold(
      errors => BadRequest(views.html.index()),
      entry => {
        DailyEntry.create(entry)
        Redirect(routes.Application.index)
      })
  }

  def deleteEntry(id: Int) = Action {
    println("In deleteEntry Application " + id)
    DailyEntry.delete(id)
    Redirect(routes.Application.index())
  }

  def updateEntry(id: Int) = Action {
    implicit request =>
      entryForm.bindFromRequest.fold(
        errors => BadRequest(views.html.index()),
        entry => {
          DailyEntry.update(id, entry)
          Redirect(routes.Application.index)
        })
  }

  val entryForm = Form(
    mapping(
      "truckNo" -> nonEmptyText,
      "source" -> nonEmptyText,
      "destination" -> nonEmptyText,
      "bookingDate" -> nonEmptyText,
      "unloadingDate" -> nonEmptyText,
      "weight" -> number,
      "freight" -> number,
      "advance" -> number,
      "balance" -> number,
      "delieveryCharge" -> number,
      "detention" -> number,
      "commision" -> number,
      "hamali" -> number,
      "remarks" -> nonEmptyText)(DailyEntry.apply)(DailyEntry.unapply))

}