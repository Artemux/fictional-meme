//<!--

function Tab()
{
	this.tabs = 0;
	this.activeCell = null;
	this.cells = {};
	this.table = null;
	this.row = null;
	this.main_div = null;
	this.Add = function(div_id, caption)
	{
		var cell = this.row.insertCell(this.tabs);
		cell.className = "inactiveCell";
		var div = document.getElementById(div_id);
		div.className = "innerDiv";
		div.style.display = "none";
		div.parentNode.removeChild(div);
		this.main_div.appendChild(div);
		cell.div = div;
		this.cells[div_id] = cell;
		++this.tabs;
		return cell;
	}
	this.SetActive = function(div_id)
	{
		if ( this.activeCell ){
			this.activeCell.className = "inactiveCell";
			this.activeCell.div.style.display = "none";
		}
		this.activeCell = this.cells[div_id];
		this.activeCell.className = "activeCell";
		this.activeCell.div.style.display = "block";
	}
	this.onload = function(main_div_id)
	{
		this.table = document.createElement('TABLE');
		this.row = this.table.insertRow(0);
		this.main_div = document.getElementById(main_div_id);
		this.main_div.appendChild(this.table);
	}
}
//-->