/* signin */
var arr = [];

function load_body() {

	if(localStorage.getItem("userInfo")) {
		var eId = localStorage.getItem("userInfo");
		employeeIn.value = eId;
	}

	if(sessionStorage.getItem('userlogin')){
		var main = document.getElementById('mainModal');
		var signin = document.getElementById('signinModal');

		signin.style.display = "none";
		main.style.display = "block";
	}

}
window.onload = function () {

	var meg = new employeeLogin("meg", "qwerty123");
	var peter = new employeeLogin("peter", "family123");
	var lois = new employeeLogin("lois", "guy123");
	var chris = new employeeLogin("chris", "griffin123");
	var stewie = new employeeLogin("stewie", "evilbaby123");
	arr = [meg, peter, lois, chris, stewie];

	document.getElementById('signIn').onclick = function(){
		var bool = authenticate(document.getElementById('saveInfo').checked);
		if(bool) {
			var main = document.getElementById('mainModal');
			var signin = document.getElementById('signinModal');

			sessionStorage.setItem('userlogin', JSON.stringify(new employeeLogin(employeeIn.value, secret.value)));

			signin.style.display = "none";
			main.style.display = "block";

		} else {
			alert("The Employee ID/Password combination is incorrect.");
		}
	}
}


function employeeLogin(id, pw) {
	this.id = id;
	this.pw = pw;
}

function authenticate(check) {

	var employeeid = employeeIn.value;
	var psswrd = secret.value;

	if(employeeid.length == 0 || psswrd.length == 0) {

		alert("The Employee ID/Password combination is incorrect.");
		if(employeeid.length == 0) {

			alert("Enter a valid Employee ID");
			document.getElementById('employeeid').focus();
			return;

		}else if(psswrd.length == 0) {

			alert("Enter a valid Password");
			document.getElementById('pw').focus();
			return;

		}
	}

	for(var i = 0; i < arr.length; i++){
		if (arr[i].id === employeeid && arr[i].pw === psswrd) {
			if(check == true) {
				localStorage.setItem('userInfo', employeeIn.value);
			}
			sessionStorage.setItem("user", employeeIn.value);
			return true;
		}
	}

	return false;
}
// End of signin page


// Main page
var sum = 0;

function start_body() {

	clear_table();

	updateTable();

}

function clear_table() {
	var tbl = document.getElementById('employeeTbl');
	tbl.getElementsByTagName("tbody")[0].innerHTML = tbl.rows[0].innerHTML;
	sum = 0;
}

function insertRow(obj) {
	var table = document.getElementById('employeeTbl');
	var row = table.insertRow();

	row.setAttribute("ondblclick", "redirect(this.rowIndex)");

	var employeeCell = row.insertCell(0);
	var dateCell = row.insertCell(1);
	var hoursCell = row.insertCell(2);
	var descCell = row.insertCell(3);
	
	employeeCell.innerHTML = obj.id;
	dateCell.innerHTML = obj.date;
	hoursCell.innerHTML = obj.hours;
	descCell.innerHTML = obj.desc;

	var num = parseFloat(obj.hours);
	sum += num;
	document.getElementById("sum").innerHTML = sum;

}


function updateTable() {

	clear_table();

	if(sessionStorage.getItem('filter') || sessionStorage.getItem('dateIn') || sessionStorage.getItem('dateOut')){
		filterList();
		return;
	}

	var array = JSON.parse(localStorage.getItem('arr'));

	if (array == null) {
		return;
	}

	for(var i = 0; i < array.length; i++){
		insertRow(array[i]);
	}

}

function click_refresh() {
	sessionStorage.setItem('filter', searchIn.value.toLowerCase());
	sessionStorage.setItem('dateIn', dateIn.value);
	sessionStorage.setItem('dateOut', dateOut.value);
	sessionStorage.setItem('currEmployee', currEmployee.checked);

	filterList();
}

function filterList() {

	clear_table();

	var filter = sessionStorage.getItem('filter');
	var datein = sessionStorage.getItem('dateIn');
	var dateout = sessionStorage.getItem('dateOut');
	var curr = sessionStorage.getItem('currEmployee');
	var user = sessionStorage.getItem('user');

	var array = JSON.parse(localStorage.getItem('arr'));

	if(array == null) return;

	var flag = true;
	for (var i = 0; i < array.length; i++) {

		if(curr == true){
			if(user !== array[i].id) flag = false;
		}

		if(filter){
			if(array[i].desc.toLowerCase().indexOf(filter) < 0) flag = false;
		}

		if(datein){
			if(array[i].date < datein) flag = false;
		}

		if(dateout){
			if(array[i].date > dateout) flag = false;
		}

		if(flag === true){
			insertRow(array[i]);
		}

		flag = true;

	}

}
// End of main page

// Edit page
function edit_body() {

	if(!sessionStorage.getItem("user")){
		location.href = "signIn.html";
	}

	if(sessionStorage.getItem('index')){
		editEntry();
	}

	document.getElementById('dateIn').valueAsDate = new Date();

	array = localStorage.getItem('arr');

}

var array;

function saveCond() {
	if (!sessionStorage.getItem('index')) {
		initNewEmployee();
	} else {
		saveEdited();
	}
}

function initNewEmployee(){

	array = JSON.parse(localStorage.getItem("arr"));

	if(array === null) array = [];

	if(employeeId.value.length == 0){
		alert("Fill in Employee ID");
		document.getElementById('employeeId').focus();
		return;
	}

	var passNum = parseFloat(hrsIn.value);
	var expand = (passNum * 100) % 25;
	if((passNum < 0 || passNum > 4) || passNum === NaN ||
	 employeeId.value.length === 0 || expand !== 0){
		alert("Fill in valid Hours Worked");
		document.getElementById('hrsIn').focus();
		return;
	}

	if(descText.value.length < 20){
		alert("Description needs to be at least 20 characters");
		document.getElementById('descText').focus();
		return;
	}

	var temp = new employee(employeeId.value, hrsIn.value, dateIn.value, descText.value, bill.checked);

	array.push(temp);

	localStorage.setItem("arr", JSON.stringify(array));
	window.location.href = "main.html";


}

function redirect(index) {
	sessionStorage.setItem('index', index);

	document.getElementById('editModal').style.display = "block";
}

function editEntry() {
	if(!sessionStorage.getItem('index')) return;

	var index = sessionStorage.getItem('index');
	var i = index - 1;

	var array = JSON.parse(localStorage.getItem('arr'));
	var modify = array[i];

	employeeId.value = modify.id;
	hrsIn.value = modify.hours;
	dateIn.value = modify.date;
	descText.value = modify.desc;
	bill.checked = modify.bill;

}

function saveEdited() {

	// if(sessionStorage.getItem('fList')) {
	// 	array = JSON.parse(sessionStorage.getItem('fList'));
	// 	var index = sessionStorage.getItem('index');
	// 	var j = index - 1;
	// 	array[j] = new employee(employeeId.value, hrsIn.value, dateIn.value, descText.value, bill.checked);
	// 	window.location.href = 'main.html';
	// }

	if(employeeId.value.length == 0){
		alert("Fill in Employee ID");
		document.getElementById('employeeId').focus();
		return;
	}

	var passNum = parseFloat(hrsIn.value);
	var expand = (passNum * 100) % 25;
	if((passNum < 0 || passNum > 4) || passNum === NaN ||
	 employeeId.value.length === 0 || expand !== 0){
		alert("Fill in valid Hours Worked");
		document.getElementById('hrsIn').focus();
		return;
	}

	if(descText.value.length < 20){
		alert("Description needs to be at least 20 characters");
		document.getElementById('descText').focus();
		return;
	}

	array = JSON.parse(localStorage.getItem('arr'));

	var pos = sessionStorage.getItem('index');
	var i = pos - 1;
	var edited = new employee(employeeId.value, hrsIn.value, dateIn.value, descText.value, bill.checked);
	array[i] = edited;
	localStorage.setItem("arr", JSON.stringify(array));
	sessionStorage.removeItem('index');
	window.location.href = "main.html";

}

function deleteRow() {

	var pos = sessionStorage.getItem('index');
	var i = pos - 1;
	array = JSON.parse(localStorage.getItem('arr'));
	array.splice(i, 1);
	localStorage.setItem('arr', JSON.stringify(array));
	sessionStorage.removeItem('index');
	window.location.href = 'main.html';

}


function employee(id, hours, date, desc, bill){
	this.id = id;
	this.hours = hours;
	this.date = date;
	this.desc = desc;
	this.bill = bill;
}
// End of edit page