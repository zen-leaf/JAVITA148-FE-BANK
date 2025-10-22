let tempusers = [];
var users = [];
var userMap = new Map();
var subUser = [];
var trans = [];
var transMap = new Map();
var subTrans = [];
var nextUserID = JSON.parse(localStorage.getItem("nextUserID")) || 1;
var nextTransID = JSON.parse(localStorage.getItem("nextTransID")) || 1;

//localStorage.setItem("nextID",JSON.stringify(1));



function clearForm(form) {
    form.reset();
};


function refreshEditForm() {
    let userSelectField = document.getElementById("userSelectionList");
    let editForm = document.getElementById("editUserForm");
    console.log(userSelectField.value);
    if (userSelectField.value == -1) {

        editForm.reset();
        return;
    }
    let usr = userMap.get(parseInt(userSelectField.value));
    editForm.nome.value = usr.nome;
    editForm.cognome.value = usr.cognome;
    editForm.datanascita.value = usr.datanascita;
    editForm.tipologia.value = usr.tipologia;
}
function renderUserList(userList) {
    if (users == null) {
        return;
    }
    if (userList == null) {
        userList = users;
    }
    let out = document.getElementById("userSelectionList");
    if (out == null) {
        return;
    }
    if (userList.length == 0) {
        return;
    }
    let list = `<option value=-1></option>`
    list += userList.map(d => d.renderUserInList()).join(" ");
    out.innerHTML = list

}

function renderUserTable(userList) {
    let out = document.getElementById('generatedUserList');
    if (out == null) {
        return;
    }
    if (userMap.size == 0) {

        out.innerHTML = `<td colspan="100%"><p class="noResultText" id="hiddenNavHelper">No users in list, head to <a href="/admin/userActions.html">the
                user action panel</a> to add a new user</p></td>`;
        return;
    }
    if (users == null) {
        return;
    }
    if (userList == null) {
        userList = users;
    }

    out.innerHTML = userList.map(d => d.renderTableRow()).join(" ");
}

function renderTransList(transactions) {
    let out = document.getElementById('generatedTransList');
    if (out == null) {
        return;
    }
    if (transMap.size == 0) {
        out.innerHTML = `<td colspan="100%"><p  id="hiddenNavHelper" class="noResultText">No transactions to show, generate one via the dedicated
                    button
                    above.</p></td>`;
        return;
    }
    if (trans == null) {
        return;
    }
    if (transactions == null) {
        transactions = trans;

    }
    out.innerHTML = transactions.map(d => d.renderTableRow()).join(" ");
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
        <td><button class="btn btn-danger" onclick="deleteuserbyid(${this.id})">Elimina</button></td>
        </tr>`;
    }
    renderUserInList() {
        return `<option value=${this.id}>${this.nome} ${this.cognome}</option>`
    }

}
function deleteuserbyid(id) {
    updateLS()
    users.splice(id, 1);
    userMap.delete(parseInt(id));
    console.log(id);
    pushUsersToStorage();
    renderUserTable();
}

function clearstorage() {
    localStorage.clear();
}

function retrieveUsersFromStorage() {


    let temp = JSON.parse(localStorage.getItem("users"));
    if (temp == null) return;
    let tusers = [];
    for (let i = 0; i < temp.length; i++) {
        let u = new User(temp[i].id, temp[i].nome, temp[i].cognome, temp[i].datanascita, temp[i].tipologia);
        tusers.push(u);
        userMap.set(u.id, u);
    }
    users = tusers;
}
function pushUsersToStorage() {
    console.log(userMap);
    localStorage.setItem("users", JSON.stringify(Array.from(userMap.values())));
}

function aggiungiUser(event) {

    event.preventDefault();

    let form = event.target;
    let response = document.getElementById("addresponse");

    if (addUser(nextUserID, form.nome.value, form.cognome.value, form.datanascita.value, form.tipologia.value)) {
        response.innerText = "Utente aggiunto con successo";
        response.style.color = "green"
        nextUserID++;
        localStorage.setItem("nextUserID", JSON.stringify(nextUserID));
        clearForm(form);
    } else {
        response.innerText = "Errore nell'aggiunta dell'utente.";
        response.style.color = "red";
    }
    response.style.visibility = "visible";

};
function addUser(id, nome, cognome, datanascita, tipologia) {
    if (nome == "" || cognome == "") {
        return false;
    }
    let b = new User(id, nome, cognome, datanascita, tipologia)
    updateLS()
    users.push(b);
    userMap.set(b.id, b);
    pushUsersToStorage();
    refresh();
    return true;

}
function rimuoviUser() {
    let userSelectField = document.getElementById("userSelectionList");
    let response = document.getElementById("editresponse");
    if (removeUser(userSelectField.value)) {
        response.innerText = "Utente rimosso con successo";
        response.style.color = "green"
    } else {
        response.innerText = "Errore nella rimozione dell'utente.";
        response.style.color = "red";
    }
    response.style.visibility = "visible";

}

function removeUser(id) {
    let _id = parseInt(id);
    updateLS()
    if (userMap.has(_id)) {
        userMap.delete(_id);
        pushUsersToStorage();
        refresh();
        return true;
    }
    return false;

}
function aggiornaUser(event) {
    event.preventDefault();
    let form = event.target;
    let response = document.getElementById("editresponse");
    if (editUser(form.userSelectionList.value, form.nome.value, form.cognome.value, form.datanascita.value, form.tipologia.value)) {

    }

}
function editUser(id, nome, cognome, data, tipo) {
    console.log(id + " " + nome + " " + cognome + " " + data + " " + tipo);
    let usr = userMap.get(parseInt(id));
    usr.nome = nome;
    usr.cognome = cognome;
    usr.datanascita = data;
    usr.tipologia = tipo;
    pushUsersToStorage();
    refresh();

}
// --------------------------- TRANSACTIONS --------------------------------
class Transaction extends Entity {
    constructor(id, owner, net, type, date) {
        super(id);
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
        <td><button class="btn btn-danger" onclick="deletetransbyid(${this.id})">Elimina</button></td>
        </tr>`;
    }

}
function deletetransbyid(id) {
    updateLS()
    transMap.delete(parseInt(id))
    pushTransactionToStorage();
    renderTransList();
}
function retrieveTransactionsFromStorage() {
    let temp = JSON.parse(localStorage.getItem("trans"));
    if (temp == null) return;
    let tTrans = [];
    for (let i = 0; i < temp.length; i++) {
        let tempTrans = new Transaction(temp[i].id, temp[i].owner, temp[i].net, temp[i].type, temp[i].date)
        tTrans.push(tempTrans);
        transMap.set(tempTrans.id, tempTrans);
    }
    trans = tTrans;
}
function pushTransactionToStorage() {
    localStorage.setItem("trans", JSON.stringify(Array.from(transMap.values())));
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateRandomTransaction() {
    updateLS()
    console.log(users);
    let randUser = users[Math.floor(Math.random() * (users.length))];
    let randAmount = Math.floor(Math.random() * 20000 * 100) / 100;
    console.log(randUser);
    let t = new Transaction(nextTransID, randUser, randAmount, "RandomAction", randomDate(new Date(1990, 1, 4), new Date()));
    trans.push(t);
    transMap.set(t.id, t);
    nextTransID++;
    localStorage.setItem("nextTransID", JSON.stringify(nextTransID));

    pushTransactionToStorage();
    renderTransList();

}
function generateRandomUser() {
    updateLS();
    if (addUser(nextUserID, "RandomName" + nextUserID, "RandomSurname" + nextUserID, "1970-01-01", "RandomlyGenerated")) {
        nextUserID++;
        localStorage.setItem("nextUserID", JSON.stringify(nextUserID));
        refresh();
    }

}
function clearTransactions() {
    trans = [];
    transMap = new Map();
    pushTransactionToStorage();
    renderTransList();
}
function clearUsers() {
    updateLS();
    users = [];
    userMap = new Map();
    pushUsersToStorage();
    refresh();
    nextUserID = 1;
    localStorage.setItem("nextUserID", JSON.stringify(nextUserID));

}
function updateLS() {
    retrieveUsersFromStorage();
    retrieveTransactionsFromStorage();
}
function refresh() {
    updateLS()
    renderUserList();
    renderUserTable();
    renderTransList();

}
function filterTransResults(by) {
    subTrans = [];
    if (by == null || by == "") {
        refresh();
        return;
    }
    transMap.forEach(e => {
        TransContainsName(e, by);
    });
    renderTransList(subTrans);

}
function filterUserResults(by) {
    subUser = [];
    if (by == null || by == "") {
        refresh();
        return;
    }

    userMap.forEach(e => {
        UserContainsName(e, by);
    });
    console.log(subUser[0]);
    renderUserTable(subUser);

}
function TransContainsName(obj, str) {

    if (obj.owner.nome.includes(str) || obj.owner.cognome.includes(str)) {
        subTrans.push(obj);
    }
}
function UserContainsName(obj, str) {
    console.log(obj instanceof User);
    if (obj.nome.includes(str) || obj.cognome.includes(str)) {
        console.log(obj);
        subUser.push(obj);
    }
}