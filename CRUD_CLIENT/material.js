function loadMaterialTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5234/api/material");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            var trHTML = '';
            const objects = JSON.parse(this.responseText);
            if(objects.length > 0){
                for (let object of objects) {
                    trHTML += '<tr>';
                    trHTML += '<td>' + object['id'] + '</td>';
                    // trHTML += '<td><img width="50px" src="' + object['avatar'] + '" class="avatar"></td>';
                    trHTML += '<td>' + object['partNumber'] + '</td>';
                    trHTML += '<td>' + object['manufacturerCode'] + '</td>';
                    trHTML += '<td>' + object['price'] + '</td>';
                    trHTML += '<td>' + object['unitOfIssue'] + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showMaterialEditBox(' + object['id'] + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="materialDelete(' + object['id'] + ')">Delete</button></td>';
                    trHTML += "</tr>";
                }
            }else{
                trHTML += '<tr>';
                trHTML += '<td colspan="6" style="text-align:center;">No data recorded.</td>';
                trHTML += "</tr>";
            }
            
            document.getElementById("materialTable").innerHTML = trHTML;
        }
    };
}

document.getElementById("pills-material-tab").addEventListener('show.bs.tab', function (event) {
    loadMaterialTable();
});

loadMaterialTable();

function showMaterialCreateBox() {
    Swal.fire({
        title: 'Create Material',
        showCancelButton: true,
        html:
            '<input id="id" type="hidden">' +
            '<input id="partNumber" class="swal2-input" placeholder="Part Number">' +
            '<input id="manufacturerCode" type="number" class="swal2-input" placeholder="Manufacturer Code">' +
            '<input id="price" type="number" class="swal2-input" placeholder="Price">' +
            '<input id="unitOfIssue" class="swal2-input" placeholder="Unit of Issue">',
        focusConfirm: false,
        preConfirm: () => {
            materialCreate();
        }
    })
}

function materialCreate() {
    const partNumber = document.getElementById("partNumber").value;
    const manufacturerCode = document.getElementById("manufacturerCode").value;
    const price = document.getElementById("price").value;
    const unitOfIssue = document.getElementById("unitOfIssue").value;

    // console.log("partNumber");
    // console.log(partNumber);

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:5234/api/material");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "partNumber": partNumber,
        "manufacturerCode": manufacturerCode,
        "price": price,
        "unitOfIssue": unitOfIssue,
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            Swal.fire("Material created successfully !");
            loadMaterialTable();
        }
    };
}

function materialDelete(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:5234/api/material/" + id);
    // xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            Swal.fire("Material deleted successfully !");
            loadMaterialTable();
        }
    };
}

function showMaterialEditBox(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5234/api/material/" + id);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.status == 200) {
            const material = JSON.parse(this.responseText);
            // console.log(material);
            Swal.fire({
                title: 'Edit Material',
                showCancelButton: true,
                html:
                    '<input id="id" type="hidden" value=' + material['id'] + '>' +
                    '<input id="partNumber" class="swal2-input" placeholder="Part Number" value="' + material['partNumber'] + '">' +
                    '<input id="manufacturerCode" type="number" class="swal2-input" placeholder="Manufacturer Code" value="' + material['manufacturerCode'] + '">' +
                    '<input id="price" type="number" class="swal2-input" placeholder="Price" value="' + material['price'] + '">' +
                    '<input id="unitOfIssue" class="swal2-input" placeholder="Unit of Issue" value="' + material['unitOfIssue'] + '">',
                focusConfirm: false,
                preConfirm: () => {
                    materialEdit();
                }
            })
        }
    };
}

function materialEdit() {
    const id = document.getElementById("id").value;
    const partNumber = document.getElementById("partNumber").value;
    const manufacturerCode = document.getElementById("manufacturerCode").value;
    const price = document.getElementById("price").value;
    const unitOfIssue = document.getElementById("unitOfIssue").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:5234/api/material/" + id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "id": id,
        "partNumber": partNumber,
        "manufacturerCode": manufacturerCode,
        "price": price,
        "unitOfIssue": unitOfIssue,
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            Swal.fire("Material updated successfully !");
            loadMaterialTable();
        }
    };
}
