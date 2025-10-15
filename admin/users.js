

class User {

    constructor(nome, cognome, datanascita, tipologia) {
        this.nome = nome;
        this.cognome = cognome;
        this.datanascita = datanascita;
        this.tipologia = tipologia;
    }

    renderTableRow() {
        return `<tr>
        <td>${this.nome}</td>
        <td>${this.cognome}</td>
        <td>${this.datanascita}</td>
        <td>${this.tipologia}</td>
        <td><button onclick="deletebyid(${users.indexOf(this)})">Elimina</button></td>
        </tr>`;
    }

}
function deletebyid(id) {
    retrieveUsersFromStorage();
    users.splice(id, 1);
    pushUsersToStorage();
    renderizzaTabellaNew();
}

let tempusers = [];
var users = []
// users = [new User("Mario", "Merola", "01/01/1971", "Ordinario")]
function clearstorage() {
    localStorage.clear();
}
// const dummy = [new User("dummy","dummy","01/01/1970","Ordinario"), new User("dummy","dummy","01/01/1970","Ordinario")];
// if (localStorage.getItem("users") == null || localStorage.getItem("users").length <= 1) {
//     console.log("resetting to def");
//     localStorage.setItem("users", JSON.stringify(dummy));

// }
function aggiungiUser(event) {

    event.preventDefault();

    const form = event.target;
    let response = document.getElementById("addresponse");

    if (addUser(form.nome.value, form.cognome.value, form.datanascita.value, form.tipologia.value)) {
        response.innerText = "Utente aggiunto con successo";
        response.style.color = "green"
        clearForm(form);
    } else {
        response.innerText = "Errore nell'aggiunta dell'utente.";
        response.style.color = "red";
    }
    response.style.visibility = "visible";

};

function addUser(nome, cognome, datanascita, tipologia) {
    if (nome == "" || cognome == "") {
        return false;
    }
    let b = new User(nome, cognome, datanascita, tipologia)
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

function clearForm(form) {
    form.reset();

};
function retrieveUsersFromStorage() {
    let temp = JSON.parse(localStorage.getItem("users"));
    console.log(temp);
    if (temp == null) return {}
    let tusers = [];
    for (let i = 0; i < temp.length; i++) {
        tusers.push(new User(temp[i].nome, temp[i].cognome, temp[i].datanascita, temp[i].tipologia))
    }
    users = tusers;
}
function pushUsersToStorage() {

    localStorage.setItem("users", JSON.stringify(users));
}
function renderizzaTabellaNew() {
    retrieveUsersFromStorage();
    console.log(users);
    var out = document.getElementById('table-output');
    if (out == null) {
        return;
    }
    if (users.length == 0) {
        document.getElementById("hiddenNavHelper").style.display = "";
        return;
    }
    document.getElementById('table-output').innerHTML = users.map(d => d.renderTableRow()).join(" ");
}
renderizzaTabellaNew();
