/**
 * 
 */

$(document).ready(function(){
	
	$("#printPage").click(function(){
		$('#billingSummary').printElement();
	});
	
	$("#modifyDiv").hide();
	$("#truckDetails").hide();
	
	$("#fromDate").datepicker({ dateFormat: 'dd-mm-yy' });
	$("#toDate").datepicker({ dateFormat: 'dd-mm-yy' });
	
	function addTruckNos() {
		$.ajax({
			url : "http://localhost:8080/tims-1.0-SNAPSHOT/truck/truckNos",
			type : "get",
			success : function(data) {
				var length = data.length
				for ( var i = 0; i < length; i++) {
					$("#truckOption").append(
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
	
	function toyymmdd(date){
		var ddmmyy = date.split("-")
		return ddmmyy[2]+"-" +ddmmyy[1]+"-"+ddmmyy[0]
	}
	
	$("#billingSubmit").click(function(){
		
		var from = $("#fromDate").val();
		var to = $("#toDate").val();
		var truck_no = $("#truckOption").val();
		 $.ajax({
			 type:'Get',
			 url:"http://localhost:8080/tims-1.0-SNAPSHOT/billing/"+truck_no+"/"+toyymmdd(from)+"/"+toyymmdd(to),
			 success:function(data) {
				 $("#truckDetails").show();
					 var billingObject =data;
					 var length = billingObject.length;
					 for(var i=0; i<length; i++){
					 $("#truckDetailTable").append("<tr><td>"+(i+1)+"</td>"+"<td>"+getConvertedDate(billingObject[i].bookingDate)+"</td>"+"<td>"+billingObject[i].source+"</td>"
					 +"<td>"+billingObject[i].destination+"</td>"+"<td>"+billingObject[i].freight+"</td>"+"<td>"+billingObject[i].advance+"</td>"
					 +"<td>"+billingObject[i].commision+"</td>"+"<td>"+billingObject[i].hamali+"</td></tr>");
					 }
					 var freight = add(length, 4);
					 var advance = add(length, 5);
					 var commision = add(length, 6);
					 var hamali = add(length, 7);
					 $("#billingSummary").append("<p>Total Freight = "+freight+"</p>");
					 $("#billingSummary").append("<p >Total Advance = "+advance+"</p>");
					 $("#billingSummary").append("<p> Total Commision = "+commision+"</p>");
					 $("#billingSummary").append("<p> Total Hamali = "+hamali+"</p>");
			 },
			 error:function(){
		          alert("failure");
		      }
		    });
	 });
	
	$("#truckDetailTable").delegate(".tableBtn", "click", function(){
		$("#modifyDiv").show();
		$("#dailyEntry").hide();
		var id = $(this).attr("id");
        var index = Math.floor(id);
        localStorage.index = index;
        
        	$("#truckNo").val(billingObject[index].entry.truckId);
            $("#source").val(billingObject[index].entry.source);
            $("#destination").val(billingObject[index].entry.destination);
            $("#bookingDate").val(billingObject[index].entry.bookingDate);
            $("#unloadingDate").val(billingObject[index].entry.unloadingDate);
            $("#weight").val(billingObject[index].entry.weight);
            $("#freight").val(billingObject[index].freight);
            $("#advance").val(billingObject[index].advance);
            $("#balance").val(billingObject[index].balance);
            $("#delieveryCharge").val(billingObject[index].delieveryCharge);
            $("#detention").val(billingObject[index].detention);
            $("#commision").val(billingObject[index].commision);
            $("#hamali").val(billingObject[index].hamali);
            $("#remarks").val(billingObject[index].entry.remarks);	
        
        
	});
	
	$("#dailyEntryDelete").click(function(){
		event.preventDefault();
		var  id = billingObject[localStorage.index].billingId;

		$.ajax({
			 type:'Get',
			 url:'http://localhost:8080/TIMS/deleteEntry/'+id,
			 success:function(data) {
				 alert("Record deleted Successfully!!");
			 },
			 error:function(){
		          alert("failure");
		      }
		    });
		
	});
	
	
	$("#dailyEntryUpdate").click(function(){
		event.preventDefault();
		var values = $("#dailyEntryForm").serializeArray();
		
        var id = billingObject[localStorage.index].billingId;
		var BookingDate=getConvertedDate(billingObject[localStorage.index].entry.bookingDate);
		var UnloadingDate = getConvertedDate(billingObject[localStorage.index].entry.unloadingDate);
		
		values.push({name:"Id", value:id});
		values.push({name:"BookingDate", value:BookingDate});
		values.push({name:"UnloadingDate", value:UnloadingDate});
		
		$.ajax({
		      url: "http://localhost::8080/tims-1.0-SNAPSHOT/UpdateEntry/update",
		      type: "POST",
		      data: values,
		      success: function(){
		          alert("Record updated successfully");
		      },
		      error:function(){
		          alert("failure");
		      }   
		    });
	});
	
	function getConvertedDate(date){
		var convertedDate = new Date(date)
	    return convertedDate.getDate()+"-"+(convertedDate.getMonth()+1)+"-"+convertedDate.getFullYear();
	}
	
	function add(length, index){
		var sum=0;
		for(var i=0; i<length ; i++){
			var strValue  = $("#truckDetailTable tr:eq("+(i+1)+") td:eq("+index+")").text();
			var intValue = Math.floor(strValue);
			sum = sum + intValue;
		}
		
		return sum;
	}
	
});
