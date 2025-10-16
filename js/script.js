let tempusers = [];
var users = [];
var trans = [];
var nextID = JSON.parse(localStorage.getItem("nextID")) || 1;

//localStorage.setItem("nextID",JSON.stringify(1));



function clearForm(form) {
    form.reset();
};


function renderUserList() {
    retrieveUsersFromStorage();
    var out = document.getElementById('generatedUserList');
    if (out == null) {
        return;
    }
    if (users.length == 0) {
        document.getElementById("hiddenNavHelper").style.display = "";
        out.innerHTML = "";
        return;
    }
    document.getElementById("hiddenNavHelper").style.display = "none";

    out.innerHTML = users.map(d => d.renderTableRow()).join(" ");
}
function renderTransList() {
    retrieveTransactionsFromStorage();
    var out = document.getElementById('generatedTransList');
    if (out == null) {
        return;
    }
    if (trans.length == 0) {
        document.getElementById("hiddenNavHelper").style.display = "";
        out.innerHTML = "";
        return;
    }
    document.getElementById("hiddenNavHelper").style.display = "none";

    out.innerHTML = trans.map(d => d.renderTableRow()).join(" ");
}
// ------------------------------ USERS ------------------------------------

class Entity {
    constructor(id) {
        this.id = id;
    }
}
class User extends Entity {

    constructor(id, nome, cognome, datanascita, tipologia) {
        super(id);
        this.nome = nome;
        this.cognome = cognome;
        this.datanascita = datanascita;
        this.tipologia = tipologia;
    }

    renderTableRow() {
        return `<tr>
        <td>${this.id}</td>
        <td>${this.nome}</td>
        <td>${this.cognome}</td>
        <td>${this.datanascita}</td>
        <td>${this.tipologia}</td>
        <td><button onclick="deleteuserbyid(${users.indexOf(this)})">Elimina</button></td>
        </tr>`;
    }

}
function deleteuserbyid(id) {
    retrieveUsersFromStorage();
    users.splice(id, 1);
    pushUsersToStorage();
    renderUserList();
}


function clearstorage() {
    localStorage.clear();
}

function retrieveUsersFromStorage() {
    let temp = JSON.parse(localStorage.getItem("users"));
    if (temp == null) return;
    let tusers = [];
    for (let i = 0; i < temp.length; i++) {
        tusers.push(new User(temp[i].id, temp[i].nome, temp[i].cognome, temp[i].datanascita, temp[i].tipologia))
    }
    users = tusers;
}
function pushUsersToStorage() {

    localStorage.setItem("users", JSON.stringify(users));
}

function aggiungiUser(event) {

    event.preventDefault();

    const form = event.target;
    let response = document.getElementById("addresponse");

    if (addUser(nextID,form.nome.value, form.cognome.value, form.datanascita.value, form.tipologia.value)) {
        response.innerText = "Utente aggiunto con successo";
        response.style.color = "green"
        nextID++;
        localStorage.setItem("nextID", JSON.stringify(nextID));
        clearForm(form);
    } else {
        response.innerText = "Errore nell'aggiunta dell'utente.";
        response.style.color = "red";
    }
    response.style.visibility = "visible";

};
function addUser(id,nome, cognome, datanascita, tipologia) {
    if (nome == "" || cognome == "") {
        return false;
    }
    let b = new User(id, nome, cognome, datanascita, tipologia)
    retrieveUsersFromStorage();
    users.push(b);
    pushUsersToStorage();
    return true;

}
function rimuoviUser(event) {
    event.preventDefault();

    const form = event.target;
    let response = document.getElementById("removeresponse");
    if (removeUser(form.name.value, form.cognome.value)) {
        response.innerText = "Utente rimosso con successo";
        response.style.color = "green"
    } else {
        response.innerText = "Errore nella rimozione dell'utente.";
        response.style.color = "red";
    }
    response.style.visibility = "visible";

}
function removeUser(nome, cognome) {
    retrieveUsersFromStorage();
    for (let i = 0; i < users.length; i++) {
        if (users[i].nome === nome && users[i].cognome === cognome) {
            users.splice(i, 1)
            pushUsersToStorage();
            return true;
        }
    }
    return false;

}
// --------------------------- TRANSACTIONS --------------------------------
class Transaction {
    constructor(owner, net, type, date) {
        this.owner = owner;
        this.net = net;
        this.type = type;
        this.date = date;
    }
    renderTableRow() {
        return `<tr>
        <td>${this.owner.cognome} ${this.owner.nome}</td>
        <td>${this.net}</td>
        <td>${this.type}</td>
        <td>${this.date}</td>
        <td><button onclick="deletetransbyid(${trans.indexOf(this)})">Elimina</button></td>
        </tr>`;
    }

}
function deletetransbyid(id) {
    retrieveTransactionsFromStorage();
    trans.splice(id, 1);
    pushTransactionToStorage();
    renderTransList();
}
function retrieveTransactionsFromStorage() {
    let temp = JSON.parse(localStorage.getItem("trans"));
    if (temp == null) return;
    let tTrans = [];
    for (let i = 0; i < temp.length; i++) {
        tTrans.push(new Transaction(temp[i].owner, temp[i].net, temp[i].type, temp[i].date));
    }
    trans = tTrans;
}
function pushTransactionToStorage() {
    localStorage.setItem("trans", JSON.stringify(trans));
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateRandomTransaction() {
    retrieveUsersFromStorage()
    retrieveTransactionsFromStorage();
    console.log(users);
    let randUser = users[Math.floor(Math.random() * (users.length))];
    let randAmount = Math.floor(Math.random() * 20000 * 100) / 100;
    console.log(randUser);
    trans.push(new Transaction(randUser, randAmount, "RandomAction", randomDate(new Date(1990, 1, 4), new Date())))
    pushTransactionToStorage();
    renderTransList();

}
function clearTransactions() {
    trans = [];
    pushTransactionToStorage();
    renderTransList();
}