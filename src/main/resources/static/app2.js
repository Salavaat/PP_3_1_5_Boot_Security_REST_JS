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