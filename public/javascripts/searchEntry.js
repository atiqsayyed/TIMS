$(document).ready(function() {
 
	$("#truckDetails").hide();
	$("#updateEntry").hide();

	function yesnodialog(button1, button2, element) {

		var btns = {};
		
		btns[button1] = function() {
			var id = element.parent().attr('id')
			var data = {"entry_id" : id};
			$.ajax({
			 url : "http://localhost:9000/entries/delete/"+id,
			 type : "post",
			 success : function() {
				 element.parent().parent().remove();
			 alert("success");
			 },
			 error : function() {
			 alert("failure");
			 }
			 });	
			
			$(this).dialog("close");
		};

		btns[button2] = function() {
			$(this).dialog("close");
		};
		$("<div></div>").dialog({
			autoOpen : true,
			title : 'Do you want to delete the Record?',
			modal : true,
			buttons : btns
		});
	}


	function populateForm(data){
		var entry = data[0]
		$("#truckNo").val(entry.truckNo)
		$("#source").val(entry.source)
		$("#destination").val(entry.destination)
		$("#bookingDate").val(getConvertedDate(entry.bookingDate))
		$("#unloadingDate").val(getConvertedDate(entry.unloadingDate))
		$("#weight").val(entry.weight)
		$("#freight").val(entry.freight)
		$("#advance").val(entry.advance)
		$("#balance").val(entry.balance)
		$("#delieveryCharge").val(entry.delieveryCharge)
		$("#detention").val(entry.detention)
		$("#commision").val(entry.commision)
		$("#hamali").val(entry.hamali)
		$("#remarks").val(entry.remarks)
		$("#ownerFreight").val(entry.ownerFreight)
		$("#ownerAdvance").val(entry.ownerAdvance)
		$("#ownerBalance").val(entry.ownerBalance)
		$("#ownerDetention").val(entry.ownerDetention)
	}
	
	$("#truckDetailTable").on('click', '.tableBtn .update', function() {
	   updateId = $(this).parent().attr('id')
		
		$.ajax({
			 url : "http://localhost:9000/entries/getEntry/"+updateId,
			 type : "get",
			 success : function(data) {
			     $("#dailyEntry").hide()
			     $("#updateEntry").show();
			     $("#dailyEntryForm").show();
			     $("#header").text("Modify")
			     populateForm(data);
			 },
			 error : function() {
			 alert("failure");
			 }
			 });	
		
	})

	$("#truckDetailTable").on('click', '.tableBtn .delete', function() {
		yesnodialog('Yes', 'No', $(this))

	})

	$("#fromDate").datepicker({
		dateFormat : 'dd-mm-yy'
	});
	$("#toDate").datepicker({
		dateFormat : 'dd-mm-yy'
	});

	function toyymmdd(date) {
		var ddmmyy = date.split("-")
		return ddmmyy[2] + "-" + ddmmyy[1] + "-" + ddmmyy[0]
	}

	function getConvertedDate(date) {
		var convertedDate = new Date(date)
		return convertedDate.getDate() + "-" + (convertedDate.getMonth() + 1) + "-" + convertedDate.getFullYear();
	}


	$("#searchSubmit").click(function() {
		$("#truckDetails").show();
		$("#truckDetailTable").find("tr:gt(0)").remove();	
		
		var from = $("#fromDate").val();
		var to = $("#toDate").val();
		var truck_no = $("#truckOption").val();
		$.ajax({
			type : 'Get',
			url : "http://localhost:9000/billing/" + truck_no + "/" + toyymmdd(from) + "/" + toyymmdd(to),
			success : function(data) {
				billingObject = data;
				var length = billingObject.length;

				for (var i = 0; i < length; i++) {
					$("#truckDetailTable").append("<tr><td>" + (i + 1) + "</td>" + "<td>" + getConvertedDate(billingObject[i].bookingDate) + "</td>" + "<td>" + billingObject[i].source + "</td>" + "<td>" + billingObject[i].destination + "</td>" + "<td>" + billingObject[i].freight + "</td>" + "<td>" + billingObject[i].advance + "</td>" + "<td>" + billingObject[i].commision + "</td>" + "<td>" + billingObject[i].hamali + "</td><td  id=" + billingObject[i].entry_id + " class=tableBtn ><img id=" + i + " src=/assets/images/update.png class=update>"+
							"<img id=" + i + " src=/assets/images/delete.png class=delete></td></tr>");
				}

			},
			error : function() {
				alert("failure");
			}
		});

	});
	
	
	$("#dailyEntryForm").submit(function(event) {
		event.preventDefault();

		var values = $(this).serialize();

		$.ajax({
			url : "http://localhost:9000/entries/update/"+updateId,
			type : "post",
			data : values,
			success : function() {
				alert("Entry updated Successfully");
				location.reload();
			},
			error : function() {
				alert("failure");
			}
		});
	});

});
