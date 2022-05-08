var inputFields = {
    name: "",
    email: "",
    mobile: ""
}

var validator = {
    name: false,
    email: false,
    mobile: false
}

var isTouched = {
    name: false,
    email: false,
    mobile: false
}

var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
var nameRegex = /^[a-zA-Z0-9 ]+$/
var mobRegex = /^[0-9]{10}$/

var dy_table_head = document.createElement("thead");
var dy_table_body = document.createElement("tbody");
var outer_div = document.getElementById("output-box");

function tableRowData(values, tag) {
    var dy_table_head_row = document.createElement("tr");
    for (var i = 0; i < values.length; ++i) {
        var dy_table_head = document.createElement(tag);
        dy_table_head.appendChild(document.createTextNode(values[i].length ? values[i] : "-"));
        dy_table_head_row.appendChild(dy_table_head);
    }
    return dy_table_head_row;
}

function tableCreation() {
    var dy_table = document.createElement("table");
    dy_table.setAttribute("border", "1");
    dy_table.setAttribute("class", "table table-striped table-bordered");
    dy_table.appendChild(dy_table_head);
    dy_table.appendChild(dy_table_body);
    outer_div.appendChild(dy_table);
}

function genericValidator(value, idInValid, errorMessage, regex, event) {
    // console.log("event", event);
    var errorBox = document.getElementById(idInValid);
    if (regex.test(value)) {
        errorBox.innerHTML = "";
        validator = {...validator, [event.target.name]: true }
    } else {
        errorBox.innerHTML = errorMessage;
        errorBox.setAttribute("class", "form-text text-danger")
        validator = {...validator, [event.target.name]: false };
    }
}

function handleTouch(event) {
    isTouched = {...isTouched, [event.target.name]: true }
}

function validatorFunc(event) {
    if (isTouched.name) {
        genericValidator(inputFields.name, "nameValid", "Enter fullname/remove special characters(@#$%^&*)", nameRegex, event);
    }
    if (isTouched.email) {
        genericValidator(inputFields.email, "emailValid", "Email is invalid", emailRegex, event);
    }
    if (isTouched.mobile) {
        genericValidator(inputFields.mobile, "mobileValid", "Mobile Number is invalid", mobRegex, event);
    }

    if ((inputFields.mobile.length === 0 || validator.mobile) && (validator.email && validator.name)) {
        submit_button.setAttribute("class", "btn mt-2 btn-success");
        submit_button.disabled = false;
    } else {
        submit_button.setAttribute("class", "btn mt-2 btn-danger");
        submit_button.disabled = true;
    }
}

function handleChange(event) {
    inputFields = {...inputFields, [event.target.name]: event.target.value }
    validatorFunc(event);
    console.log("Input Fields", inputFields);
    console.log("Touched", isTouched);
    console.log("Validator", validator);
}

var submit_button = document.getElementById("submit_button");
submit_button.disabled = true;
submit_button.setAttribute("class", "btn mt-2 btn-danger");
const prevData = localStorage.getItem("data") && JSON.parse(localStorage.getItem("data"));
(submit_button).onclick = (event) => {
    event.preventDefault();
    console.log(inputFields);
    console.log(prevData);
    if (prevData) {
        dy_table_body.appendChild(tableRowData([inputFields.name, inputFields.email, inputFields.mobile], "td"));
        localStorage.setItem("data", JSON.stringify([...prevData, inputFields]));
    } else {
        tableCreation();
        dy_table_head.appendChild(tableRowData(["Name", "Email", "Mob No"], "th"));
        dy_table_body.appendChild(tableRowData([inputFields.name, inputFields.email, inputFields.mobile], "td"));
        localStorage.setItem("data", JSON.stringify([inputFields]));
    }
    inputFields = {
        name: "",
        email: "",
        mobile: ""
    }

    validator = {
        name: false,
        email: false,
        mobile: false
    }

    isTouched = {
        name: false,
        email: false,
        mobile: false
    }
    prev = JSON.parse(localStorage.getItem("data"));
    submit_button.setAttribute("class", "btn mt-2 btn-danger");
    submit_button.disabled = true;
    document.querySelector('form').reset();
}

if (prevData == null) {
    const errorBox = document.createElement("p");
    errorBox.setAttribute("class", "text-center fs-1");
    errorBox.innerHTML = "No Data Available";
    outer_div.appendChild(errorBox);
} else {
    console.log(prevData);
    tableCreation();
    dy_table_head.appendChild(tableRowData(["Name", "Email", "Mob No"], "th"));
    prevData.map((item) => {
        dy_table_body.appendChild(tableRowData([item.name, item.email, item.mobile], "td"));
    })
}