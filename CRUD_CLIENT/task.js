function loadTaskTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5234/api/myTask");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            // console.log(this.responseText);
            var trHTML = '';
            const objects = JSON.parse(this.responseText);
            if(objects.length > 0){
                for (let object of objects) {
                    trHTML += '<tr>';
                    trHTML += '<td>' + object['id'] + '</td>';
                    trHTML += '<td>' + object['name'] + '</td>';
                    trHTML += '<td>' + object['description'] + '</td>';
                    trHTML += '<td>' + object['totalDuration'] + '</td>';
                    trHTML += '<td>' + object['material'] + '</td>';
                    trHTML += '<td>' + object['amount'] + '</td>';
                    trHTML += '<td>' + object['unitOfMeasurement'] + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showTaskEditBox(' + object['id'] + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="taskDelete(' + object['id'] + ')">Delete</button></td>';
                    trHTML += "</tr>";
                }
            }else{
                trHTML += '<tr>';
                trHTML += '<td colspan="8" style="text-align:center;">No data recorded.</td>';
                trHTML += "</tr>";
            }
            document.getElementById("taskTable").innerHTML = trHTML;
        }
    };
}

var selectHTML = '';
document.getElementById("pills-task-tab").addEventListener('show.bs.tab', function (event) {
    loadTaskTable();
    loadAllMaterials();
});

function loadAllMaterials(){
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5234/api/material");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            selectHTML = '<select id="selectMaterials" class="swal2-input">';
            const objects = JSON.parse(this.responseText);

            selectHTML += '<option value="0" disabled selected>Select Material</option>';
            for (let object of objects) {
                selectHTML += '<option value="'+ object['id'] + '">' + object['partNumber'] + '</option>';
            }
            selectHTML += "</select>";
        }
    };
}

function showTaskCreateBox() {
    
    Swal.fire({
        title: 'Create Task',
        showCancelButton: true,
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="description" class="swal2-input" placeholder="Description">' +
            '<input id="totalDuration" type="number" class="swal2-input" placeholder="Total Duration">' +
            selectHTML +
            '<input id="amount" type="number" class="swal2-input" placeholder="Amount">'+
            '<input id="unitOfMeasurement" class="swal2-input" placeholder="Unit of Measurement">',
        focusConfirm: false,
        preConfirm: () => {
            taskCreate();
        }
    })
}

function taskCreate() {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const totalDuration = document.getElementById("totalDuration").value;
    const materialId = document.getElementById("selectMaterials").value;
    var material;
    const amount = document.getElementById("amount").value;
    const unitOfMeasurement = document.getElementById("unitOfMeasurement").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5234/api/material/" + materialId);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            material = JSON.parse(this.responseText);
            
            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", "http://localhost:5234/api/myTask");
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify({
                "name": name,
                "description": description,
                "totalDuration": totalDuration,
                "materialId": materialId,
                "material": material.partNumber,
                "amount": amount,
                "unitOfMeasurement": unitOfMeasurement,
            }));
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    Swal.fire("Task created successfully !");
                    loadTaskTable();
                }
            };
        }
    };

}

function taskDelete(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:5234/api/myTask/" + id);
    // xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            Swal.fire("Task deleted successfully !");
            loadTaskTable();
        }
    };
}

function showTaskEditBox(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5234/api/material");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            selectHTML = '<select id="selectMaterials" class="swal2-input">';
            const objects = JSON.parse(this.responseText);

            for (let object of objects) {
                if(id == object['id'])
                    selectHTML += '<option value="'+ object['id'] + '" selected>' + object['partNumber'] + '</option>';
                else
                    selectHTML += '<option value="'+ object['id'] + '">' + object['partNumber'] + '</option>';
            }
            selectHTML += "</select>";


            const xhttp = new XMLHttpRequest();
            xhttp.open("GET", "http://localhost:5234/api/myTask/" + id);
            xhttp.send();
            xhttp.onreadystatechange = function () {
                if (this.status == 200) {
                    const task = JSON.parse(this.responseText);
                    // console.log(task);
                    Swal.fire({
                        title: 'Edit Task',
                        showCancelButton: true,
                        html:
                            '<input id="id" type="hidden" value="' + task['id'] + '">' +
                            '<input id="name" class="swal2-input" value="' + task['name'] + '">' +
                            '<input id="description" class="swal2-input" value="' + task['description'] + '">' +
                            '<input id="totalDuration" type="number" class="swal2-input" value="' + task['totalDuration'] + '">' +
                            selectHTML +
                            '<input id="amount" type="number" class="swal2-input" value="' + task['amount'] + '">'+
                            '<input id="unitOfMeasurement" class="swal2-input" value="' + task['unitOfMeasurement'] + '">',
                        focusConfirm: false,
                        preConfirm: () => {
                            taskEdit();
                        }
                    })
                }
            };
        }
    };

}

function taskEdit() {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const totalDuration = document.getElementById("totalDuration").value;
    const materialId = document.getElementById("selectMaterials").value;
    var material;
    const amount = document.getElementById("amount").value;
    const unitOfMeasurement = document.getElementById("unitOfMeasurement").value;

    
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5234/api/material/" + materialId);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            material = JSON.parse(this.responseText);
            
            const xhttp = new XMLHttpRequest();
            xhttp.open("PUT", "http://localhost:5234/api/myTask/" + id);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify({
                "id": id,
                "name": name,
                "description": description,
                "totalDuration": totalDuration,
                "materialId": materialId,
                "material": material.partNumber,
                "amount": amount,
                "unitOfMeasurement": unitOfMeasurement,
            }));
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    Swal.fire("Task updated successfully !");
                    loadTaskTable();
                }
            };
        }
    };

}
