package controllers

import play.api.mvc.Controller
import play.api.mvc.Action
import play.api.libs.json.Json
import models.Number
import models.TruckDetail
import play.api.data.Form
import play.api.data.Forms.mapping
import play.api.data.Forms.nonEmptyText

object TruckController extends Controller {

  def index = Action {
    Ok(views.html.truckDetails())
  }

  def truckNos = Action {
    implicit val entryWrites = Json.writes[Number]
    val numbers = TruckDetail.getTruckNos
    Ok(Json.toJson(numbers))
  }
  def addTruck = Action { implicit request =>
    truckForm.bindFromRequest.fold(
      errors => BadRequest(views.html.index()),
      truck => {
        TruckDetail.createTruck(truck)
        Redirect(routes.Application.index)
      })

  }

  def deleteTruck(truckNo: String) = Action {
    TruckDetail.deleteTruck(truckNo);
    Ok(views.html.truckDetails())
  }

  def getTruck(truckNo: String) = Action {
    implicit val entryWrites = Json.writes[TruckDetail]
    val truckDetails = TruckDetail.getTruckDetail(truckNo)
    Ok(Json.toJson(truckDetails))
  }

  def updateTruck(truckNo: String) = Action { implicit request =>
    truckForm.bindFromRequest.fold(
      errors => BadRequest(views.html.index()),
      truck => {
        TruckDetail.updateTruck(truckNo, truck)
        Redirect(routes.Application.index)
      })
  }

  val truckForm = Form(
    mapping("truckNo" -> nonEmptyText,
      "driver" -> nonEmptyText,
      "owner" -> nonEmptyText,
      "insuranceNo" -> nonEmptyText)(TruckDetail.apply)(TruckDetail.unapply))
}