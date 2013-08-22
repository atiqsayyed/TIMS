$(document)
		.ready(
				function() {

					jQuery.validator.setDefaults({
						debug : true,
						success : "valid"
					});

					var form = $("#dailyEntryForm")
							.validate(
									{
										rules : {
											truckNo : "required",
											source : "required",
											destination : "required",
											bookingDate : "required",
											unloadingDate : "required",
											weight : {
												required : true,
												digits : true
											},
											freight : {
												required : true,
												digits : true
											},
											advance : {
												required : true,
												digits : true
											},
											balance : {
												required : true,
												digits : true
											},
											delieveryCharge : {
												required : true,
												digits : true
											},
											detention : {
												required : true,
												digits : true
											},
											commision : {
												required : true,
												digits : true
											},
											hamali : {
												required : true,
												digits : true
											},
											remarks : "required",

										},
										messages : {
											truckNo : "<div class='error'>Please enter Truck No</div>",
											source : "<div class='error'>Please enter Source</div>",
											destination : "<div class='error'>Please enter Destination</div>",
											bookingDate : "<div class='error'>Please enter Booking Date</div>",
											unloadingDate : "<div class='error'>Please enter Unloading Date</div>",
											weight : "<div class='error'>Please enter Weight & it should be only numbers</div>",
											freight : "<div class='error'>Please enter Freight & it should be only numbers</div>",
											advance : "<div class='error'>Please enter Advance & it should be only numbers</div>",
											balance : "<div class='error'>Please enter Balance & it should be only numbers</div>",
											delieveryCharge : "<div class='error'>Please enter Delievery Charge & it should be only numbers</div>",
											detention : "<div class='error'>Please enter detention & it should be only numbers</div>",
											commision : "<div class='error'>Please enter commision & it should be only numbers</div>",
											hamali : "<div class='error'>Please enter Hamali</div>",
											remarks : "<div class='error'>Please enter Remarks</div>"
										}
									});

					$("#bookingDate").datepicker({
						dateFormat : 'dd-mm-yy'
					});
					$("#unloadingDate").datepicker({
						dateFormat : 'dd-mm-yy'
					});

					$("#truckOptions").append("<option>Select Truck</option>")

					function addTruckNos() {
						$.ajax({
							url : "http://localhost:8080/tims-1.0-SNAPSHOT/truck/truckNos",
							type : "get",
							success : function(data) {
								var length = data.length
								for ( var i = 0; i < length; i++) {
									$("#truckOptions").append(
											"<option>" + data[i].truckNo
													+ "</option>")
								}
							},
							error : function() {
								alert("failure");
							}
						});
					}

					addTruckNos()

					$("#dailyEntryForm").submit(function(event) {
						if (form.form()) {
							event.preventDefault();

							var values = $(this).serialize();
							console.log("Values are " + values);

							$.ajax({
								url : "http://localhost:9000/entries",
								type : "post",
								data : values,
								success : function() {
									alert("success");
								},
								error : function() {
									alert("failure");
								}
							});
						}

					});
				});
