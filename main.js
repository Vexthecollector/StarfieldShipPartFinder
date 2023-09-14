function LoadCargo() {
    var thisbutton = document.getElementById("LoadCargo")
    SetButtonAsActive(thisbutton)
    LoadFile("Cargo.csv")
}
function LoadEngines() {
    var thisbutton = document.getElementById("LoadEngines")
    SetButtonAsActive(thisbutton)
    LoadFile("Engines.csv")
}
function LoadFuelTanks() {
    var thisbutton = document.getElementById("LoadFuelTanks")
    SetButtonAsActive(thisbutton)
    LoadFile("FuelTanks.csv")
}
function LoadEquipment() {
    var thisbutton = document.getElementById("LoadEquipment")
    SetButtonAsActive(thisbutton)
    LoadFile("Equipment.csv")
}
function LoadGravDrives() {
    var thisbutton = document.getElementById("LoadGravDrives")
    SetButtonAsActive(thisbutton)
    LoadFile("GravDrives.csv")
}
function LoadReactors() {
    var thisbutton = document.getElementById("LoadReactors")
    SetButtonAsActive(thisbutton)
    LoadFile("Reactors.csv")
}
function LoadShields() {
    var thisbutton = document.getElementById("LoadShields")
    SetButtonAsActive(thisbutton)
    LoadFile("Shields.csv")
}

function SetButtonAsActive(button) {
    var list = document.getElementsByClassName('active')
    for (var i = 0; i < list.length; i++) {
        list[i].classList.add('SelectButton')
        list[i].classList.remove('active')
    }
    button.classList.add('active')
    button.classList.remove('SelectButton')
}

var headers
var starterrows = []
var datarows = []

async function LoadFile(FileName) {
    starterrows = []
    regexp = /(?!\B"[^"]*),(?![^"]*"\B)/g
    await fetch(FileName)
        .then((res) => res.text())
        .then((text) => {
            var rows = text.split("\n")
            headers = rows[0].split(",")
            for (var i = 1; i < rows.length; i++) {
                starterrows[i - 1] = rows[i].split(regexp)
            }
        })
        .catch((e) => console.error(e));
    datarows = Array.from(starterrows)
    FillTable()
}

function FillTable() {
    var table = document.getElementById("MainTable")
    var headerRow = document.getElementById("HeaderRow")
    headerRow.innerHTML = ""


    for (var i = 0; i < headers.length; i++) {
        var heading = document.createElement("td")
        heading.innerHTML = headers[i]
        heading.id = i
        headerRow.appendChild(heading)
        heading.addEventListener('click', function (e) { Sort(e) })
    }
    FillRows()

}

async function CleanElements() {
    Array.from(document.querySelectorAll('.sortedA')).forEach(
        (el) => el.classList.remove('sortedA')
    );
    Array.from(document.querySelectorAll('.sortedD')).forEach(
        (el) => el.classList.remove('sortedD')
    );
    return;
}

async function Sort(input) {
    datarows = Array.from(LimitLevels(starterrows))
    var number = datarows[0][input.target.id]
    if (input.target.classList.contains("sortedA")) {
        if (!isNaN(number)) {
            datarows.sort(function (a, b) {
                return b[input.target.id] - a[input.target.id]
            })
        }
        else {
            datarows.sort(function (a, b) { return a[input.target.id] > b[input.target.id] ? 1 : -1; })
        }
        await CleanElements()
        input.target.classList.add("sortedD")

    }
    else if (input.target.classList.contains("sortedD")) {
        await CleanElements()


    }
    else {
        if (!isNaN(number)) {
            datarows.sort(function (a, b) {
                return a[input.target.id] - b[input.target.id]
            })
        }
        else {
            datarows.sort(function (a, b) { return a[input.target.id] > b[input.target.id] ? 1 : -1; })
            datarows.reverse()
        }
        await CleanElements()
        input.target.classList.add("sortedA")
    }


    FillRows()


}


function FillRows() {
    //datarows = Array.from(LimitLevels(starterrows))
    var table = document.getElementById("MainTable")
    for (var i = 1; i < table.rows.length; i) {
        table.deleteRow(1);
    }
    for (var i = 0; i < datarows.length; i++) {
        var datarow = document.createElement("tr")
        for (var j = 0; j < datarows[i].length; j++) {
            var cell = document.createElement("td")
            cell.innerHTML = datarows[i][j]
            datarow.appendChild(cell)
        }
        table.appendChild(datarow)
    }
}

function SetLimit(){
    datarows = Array.from(LimitLevels(starterrows))
    FillRows()
}

function LimitLevels(inputarray) {
    start=Number(document.getElementById("min").value)
    end=Number(document.getElementById("max").value)
    var levels = headers.indexOf('Level')
    if(levels>=0){
        return inputarray.filter(i => i[levels] <= end && i[levels] >= start)
    }
    return inputarray
}


