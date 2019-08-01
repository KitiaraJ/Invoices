window.onload = function()			//Makes sure the button won't search for the functions before they are ran
{	
	var add = document.getElementById("mySubmit");		//holds the add Item button
	var dItem = document.getElementById("delItem");		//holds the delete Item button
	add.onclick = addClick;
	dItem.onclick = delClick;
}

//global variables
var line = [];			//array to hold all of the lineItems
var sTax = .06;			//sales Tax for easy adjustment (currently set to 6% for Pennsylvania)


//==========================================
//lineItem()
//creates a data structure for the array
function lineItem(c, n, q, ic, lc)
{
	this.code = c;
	this.name = n;
	this.quant = q;
	this.cost = ic;
	this.lineCost = lc;
}

//=======================================
//chkItem(idCheck) - boolean/exception return
/*
	checks each item in the array for the input from the form
		if the item exists, return true
		if it doesn't exist return false
	also does exception for error handling 
		if the item code is Negative or not a number, it will throw it
*/
function chkItem(idCheck)
{
	var yes = false;
	while (yes != true)
	{	
		if (idCheck < 1 || isNaN(idCheck))
		{
			throw idCheck;
			yes = true;
			break;
		}
		
		else if (line.length == 0)
		{
			yes = false;
			break;
		}
		else
		{
			for (var i = 0; i < line.length; i++)
			{
				if (line[i].code == idCheck)
				{
					yes = true;
					break;
				}

				else
				{
					yes = false;
				}
			} 
			break;
		}	
	}

	return yes;
}

//==========================================
//addItem()
//adds a line item to the array
//calls chkItem
function addItem()
{
	//variables to hold the information given by the form
	var code = document.getElementById("code").value;
	var name = document.getElementById("name").value;
	var quant = document.getElementById("quant").value;
	var cost = document.getElementById("cost").value
	var lineCost = quant * cost; 				//calculated information
	var d = document.createElement("Input");
		d.setAttribute("type", "checkbox");
		d.name = "check";
	var up = 0;
	var table = document.getElementById("Inv");
	if (code != "")
	{
		try
		{
			//creates the new lineItem
			var item = new lineItem(code, name, quant, cost, lineCost);
			var yes = chkItem(item.code);
			
			//if true, check to see if they want to add to the existing quantity 
			if (yes == true)
			{
				if( confirm("Would you like to add to the existing quantity of that item? (Click okay if yes)") == true)
				{
					for(var i = 0; i < line.length; i++)
					{
						if (line[i].code == item.code)
						{
							line[i].quant = Number(line[i].quant) + Number(item.quant);
							line[i].lineCost = Number(line[i].quant) * Number(line[i].cost);
							table.deleteRow(line.indexOf(line[i]) + 1);
							var row = table.insertRow(line.indexOf(line[i]) + 1);
							var c1 = row.insertCell(0);
							var c2 = row.insertCell(1);
							var c3 = row.insertCell(2);
							var c4 = row.insertCell(3);
							var c5 = row.insertCell(4);
							var c6 = row.insertCell(5);

							//populate the cells of the table
							c1.innerHTML = line[i].code;
							c2.innerHTML = line[i].name;
							c3.innerHTML = line[i].quant;
							c4.innerHTML = line[i].cost;
							c5.innerHTML = line[i].lineCost;
							c6.appendChild(d);
						}
					}
				}
		
				else
				{
					alert("Please enter a different Item code.");
				}
			}
			//if false, adds the new line Item
			else
			{
				line.push(item);				//push the lineItem to the list	
				//takes the information gained from the conditionals above and creates the table 
				var table = document.getElementById("Inv");
				var row = table.insertRow(-1);
		
		
				//create cells for the table
				var c1 = row.insertCell(0);
				var c2 = row.insertCell(1);
				var c3 = row.insertCell(2);
				var c4 = row.insertCell(3);
				var c5 = row.insertCell(4);
				var c6 = row.insertCell(5);

				//populate the cells of the table
				for (var i = 0; i < line.length; i++)
				{
					c1.innerHTML = line[i].code;
					c2.innerHTML = line[i].name;
					c3.innerHTML = line[i].quant;
					c4.innerHTML = line[i].cost;
					c5.innerHTML = line[i].lineCost;
					c6.appendChild(d);
				}
			}
		}
	
		catch(e)
		{
			alert("Error: " + e);
			
		}
	}
}	//end addItem

//==========================================
//delLine()
//deletes the line item that the checkbox is checked on
function delLine()
{
	//checks to see which items are checked and deletes accordingly
	var table = document.getElementById("Inv");
	var check = document.getElementsByName("check");
	
	for (var i = 0; i < check.length; i++)
	{
		if (check[i].checked == true)
		{
			table.deleteRow(i + 1);		//deletes the checked rows from the table
			line.splice(i, 1);			//deletes the lineItem from the array so it won't add to the totals later on
		}
	}
}	//end delLine

//==========================================
//calculate()
//calculates the subtotal using a sum of the lineCost
function calculate()
{
	var subT = 0.00;													//sets the subtotal to a double
	var tot = 0.00;														//sets the initial total to a double
	
	for (var i = 0; i < line.length; i++)
	{
		subT = subT + line[i].lineCost;									//uses the for loop to add up the line totals
	}
	
	var taxTot = subT * sTax;											//gets the total amount of tax
	tot = subT + taxTot;												//adds the subtotal with the total tax to get the total of the invoice
	
	//gains access to the three text boxes
	var sub = document.getElementById("sub");
	var tax = document.getElementById("tax");
	var total = document.getElementById("total");
	
	//changes the values of the textboxes 
	sub.value = "$" + subT.toFixed(2);
	tax.value = "$" + taxTot.toFixed(2);
	total.value = "$" + tot.toFixed(2);
}	//end calculate

function addClick(a)
{
	addItem();			//adds an item to the table
	calculate();		//calculates the totals
	a.preventDefault();
}

function delClick(b)
{
	delLine();
	calculate();
	b.preventDefault();
}