$(document).ready(
		function() {
			
			addTruckNos()
			
			$("#deleteTruckDiv").hide();
			$("#editTruckForm").hide();
			$("#editSelectTruck").hide();
			$("#editSelectTruck").hide();
			$("#smallHeader").text("Add Truck")
			
			var Truckform = $("#addTruckForm").validate({
										rules : {
											truckNo : "required",
											driver : "required",
											owner : "required",
											insuranceNo : "required"
										},
										messages : {
											truckNo : "<div class='error'>Please enter Truck No</div>",
											driver : "<div class='error'>Please enter Driver</div>",
											owner : "<div class='error'>Please enter Owner</div>",
											insuranceNo : "<div class='error'>Please enter Insurance Number</div>"
										}
									});

			$("#deleteTruckButton").click(function() {
				$("#deleteTruckDiv").show();
				$("#editSelectTruck").hide();
				$("#editTruckForm").hide();
				$("#addTruckForm").hide();
				$("#smallHeader").text("Delete Truck")
			});

			$("#editTruckButton").click(function() {
				$("#deleteTruckDiv").hide();
				$("#editTruckForm").hide();
				$("#editSelectTruck").show();
				$("#addTruckForm").hide();
				$("#smallHeader").text("Edit Truck Details")
			});

			$("#addTruckButton").click(function() {
				$("#deleteTruckDiv").hide();
				$("#editTruckForm").hide();
				$("#editSelectTruck").hide();
				$("#addTruckForm").show();
				$("#smallHeader").text("Add Truck")
			});

			$("#editTruckSubmit").click(function() {
				var truckNo = $("#editTruckOption").val()
				$.ajax({
					url : "http://localhost:9000/truck/getTruck/" + truckNo,
					type : "get",
					success : function(data) {
						$("#editTruckNo").val(data.truckNo)
						$("#editDriver").val(data.driver)
						$("#editOwner").val(data.owner)
						$("#editInsuranceNo").val(data.insuranceNo)
						$("#editTruckForm").show();
						$("#editSelectTruck").hide();

					},
					error : function() {
						alert("failure");
					}
				});
			})

			function addTruckNos() {
				$.ajax({
					url : "http://localhost:8080/tims-1.0-SNAPSHOT/truck/truckNos",
					type : "get",
					success : function(data) {
						var length = data.length
						for ( var i = 0; i < length; i++) {
							$("#editTruckOption").append(
									"<option>" + data[i].truckNo + "</option>")
							$("#truckOption").append(
									"<option>" + data[i].truckNo + "</option>")
						}
					},
					error : function() {
						alert("failure");
					}
				});
			}

			$("#addTruckForm").submit(function(event) {
				alert(Truckform.form())
				if(Truckform.form()){
					event.preventDefault();
					var values = $(this).serialize();

					$.ajax({
						url : "http://localhost:9000/truck/addTruck",
						type : "post",
						data : values,
						success : function() {
							alert("Truck added Successfully");
						},
						error : function() {
							alert("failure");
						}
					});
	
				}
							});

			$("#deleteTruckSubmit").click(function() {
				var truckNo = $("#truckOption").val()
				console.log("no " + truckNo)
				$.ajax({
					url : "http://localhost:9000/truck/delete/" + truckNo,
					type : "post",
					success : function() {
						alert("Deleted Successfully!!. .")
					},
					error : function() {
						alert("Failure")
					}
				});
			});

			$("#editTruckForm").submit(function(event) {
				event.preventDefault();
				var truckNo = $("#editTruckNo").val()
				var values = $(this).serialize();

				$.ajax({
					url : "http://localhost:9000/truck/update/" + truckNo,
					type : "post",
					data : values,
					success : function() {
						alert("Truck edited Successfully");
					},
					error : function() {
						alert("failure");
					}
				});
			});

		});