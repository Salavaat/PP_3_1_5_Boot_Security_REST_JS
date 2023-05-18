const url1 = 'http://localhost:8080/user/page'
let userInfo = document.querySelector('#UserInfo');

fetch(url1)
    .then(res => res.json())
    .then(data => {
        userInfo.innerHTML = `
                                <td>${data.id}</td>
                                <td>${data.firstName}</td>
                                <td>${data.lastName}</td>
                                <td>${data.age}</td>
                                <td>${data.email}</td>
                                <td>${data.roles.map(role => " " + role.name.substring(5))}</td>

`;
    })


const url2 = 'http://localhost:8080/api/admin'
const update_url = 'http://localhost:8080/api/admin/'
const delete_url = 'http://localhost:8080/api/admin/'
const add_url = 'http://localhost:8080/api/admin/create/'



async function getUserById(id) {
    let urlForOneUser = update_url + id;
    return await (await fetch(urlForOneUser)).json();
}


async function getAllRoles(selectRole) {
    fetch("http://localhost:8080/api/admin/roles")
        .then(result => result.json())
        .then(data => {
            let temp = "";
            data.forEach(role =>
            {
                temp += `<option value="${role.id}">${role.name.slice(5)}</option>`;
            });
            selectRole.append(temp);
        });
}


const deleteUserForm = document.querySelector('#modalDelete')
let currentUserId = null

function getAllUsers() {
    fetch(url2)
        .then(res => res.json())
        .then(users => {
            let temp = '';
            users.forEach(function (user) {
                temp += `
                  <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${user.roles.map(role => role.name === 'ROLE_USER' ? ' USER' : ' ADMIN')}</td>
                  <td>
                       <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                        data-toggle="modal" data-target="modal" id="edit-user" data-id="${user.id}">Edit</button>
                   </td>
                   <td>
                       <button type="button" class="btn btn-danger" id="delete-user" data-action="delete"
                       data-id="${user.id}" data-target="modal">Delete</button>
                        </td>
                  </tr>`;
            });
            document.querySelector('#allUsers').innerHTML = temp;
        });
}

getAllUsers()

function refreshTable() {
    let table = document.querySelector('#allUsers')
    while (table.rows.length > 1) {
        table.deleteRow(1)
    }
    setTimeout(getAllUsers, 500);
}

//-----------------ADD---------------------------//



const createTab = document.getElementById('create');

const firstnameAdd = document.getElementById('firstname1');
const lastnameAdd = document.getElementById('lastname1');
const ageAdd = document.getElementById('age1');
const emailAdd = document.getElementById('email1');
const passwordAdd = document.getElementById('password1');
const rolesAdd = document.getElementById('chooseRole');
const selectRoleInCreate = $('#chooseRole');
getAllRoles(selectRoleInCreate);

createTab.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch(add_url, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(
            {
                firstName: firstnameAdd.value,
                lastName: lastnameAdd.value,
                age: ageAdd.value,
                email: emailAdd.value,
                password: passwordAdd.value,
                roles: getSelectedRole(rolesAdd)
            }
        )
    }).then(() => {
        createTab.reset();
        $('#allUsersTab').click();
        getAllUsers()
        $('[href="#UsersTable"]').click()
    })
        .catch(error => console.log(error));
});


function getSelectedRole(selectTag) {
    let roles = [];
    for (let i = 0; i < selectTag.options.length; i++) {
        if (selectTag.options[i].selected) roles.push({
            id: selectTag.options[i].value,
            roleName: "ROLE_" + selectTag.options[i].text
        });
    }
    return roles;
}


//---------------EDIT---------------------------//


const modalEdit = new bootstrap.Modal(document.querySelector('#modalEdit'));
const editUserForm = document.forms["editUserForm"];

const idEdit = document.getElementById('id2');
const firstnameEdit = document.getElementById('firstname2');
const lastnameEdit = document.getElementById('lastname2');
const ageEdit = document.getElementById('age2');
const emailEdit = document.getElementById('email2');
const passwordEdit = document.getElementById('password2');
const rolesEdit = document.getElementById('rolesEditUserForm');
const selectRoleInEdit = $('#rolesEditUserForm');

on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    })
}

let rowId = 0;
on(document, 'click', '#edit-user', e => {
        const row = e.target.parentNode.parentNode;
        rowId = row.firstElementChild.innerHTML
        getUserById(rowId).then(data =>{
            idEdit.value = data.id;
            firstnameEdit.value = data.firstName;
            lastnameEdit.value = data.lastName;
            ageEdit.value = data.age;
            emailEdit.value = data.email;
            passwordEdit.value = '';
            getAllRoles(selectRoleInEdit);
            modalEdit.show();
        });
    }
);

editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch(update_url, {
        method: "PATCH",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(
            {
                id: editUserForm.ID.value,
                firstName: firstnameEdit.value,
                lastName: lastnameEdit.value,
                age: ageEdit.value,
                email: emailEdit.value,
                password: passwordEdit.value,
                roles: getSelectedRole(rolesEdit)
            }
        )
    }).then(() => {
        $('#closeButtonEditForm').click();
        getAllUsers()
    })
        .catch(error => console.log(error));
});



//-------------------DELETE---------------------------//


deleteUserForm.addEventListener('submit', (e) => {
    console.log(e.target.parentNode.parentNode)
    e.preventDefault();
    e.stopPropagation();
    fetch(delete_url + currentUserId, {
        method: 'DELETE'
    })
        .then()

    $("#modalDelete").modal("hide")

    refreshTable()
})

on(document, 'click', '#delete-user', e => {
    const fila2 = e.target.parentNode.parentNode
    currentUserId = fila2.children[0].innerHTML

    document.getElementById('id3').value = fila2.children[0].innerHTML
    document.getElementById('firstname3').value = fila2.children[1].innerHTML
    document.getElementById('lastname3').value = fila2.children[2].innerHTML
    document.getElementById('age3').value = fila2.children[3].innerHTML
    document.getElementById('email3').value = fila2.children[4].innerHTML
    document.getElementById('roles3').value = fila2.children[5].innerHTML
    $("#modalDelete").modal("show")
})
