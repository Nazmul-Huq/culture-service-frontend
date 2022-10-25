
/*
* Login method
*/
const thisForm = document.getElementById('login-form');
thisForm.addEventListener('submit', async function (e) {
    document.getElementById("bad-credential").innerHTML = ""; // unset the div
    document.getElementById("json-token").innerHTML = ""; // unset the div
    e.preventDefault();
    const formData = new FormData(thisForm).entries() // get form data
    const payload = JSON.stringify(Object.fromEntries(formData)) // make payload from form data
    const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
    })
    const result = await response.json();  // get result as json object
    const token = result.token // get token from json object
    if(token === "BAD_CREDENTIAL"){ // check token value, and do logical operation
        document.getElementById("bad-credential").innerHTML = "Username and Password do not match"; // show the failure message
    } else {
        localStorage.setItem('culture_user', JSON.stringify(result)) // store the token in the local storage
        document.getElementById("json-token").innerHTML = token; // show the success message, in this case showing token
    }
}); // login method ends here

/*
* See all user button
*/
const seeAllUserBtn = document.getElementById('see-all-user')
seeAllUserBtn.addEventListener('click', async function (e) {
    document.getElementById("bad-credential").innerHTML = ""; // unset the div
    document.getElementById("json-token").innerHTML = ""; // unset the div
    $("#login-form").hide(); // hide the login form
      
    e.preventDefault();

    const localstorage_culture_user = JSON.parse(localStorage.getItem('culture_user'))
    const inMemoryToken = localstorage_culture_user.token
    try {
        const response = await fetch('http://localhost:8080/api/user/get-user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + inMemoryToken },
    })
    const result = await response.json();  // get result as json object

    

    const tableStartTags = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Username</th>
                </tr>
            </thead>
            <tbody>
        `
    const tableClosingTag =`
            </tbody>
        </table>
        `

    let tableRows = null;
    for (let index = 0; index < result.length; index++) {
        let tableRow = `
        <tr>
            <th scope="row">${result[index].id}</th>
            <td>${result[index].name}</td>
            <td>${result[index].username}</td>
        </tr>
        `
        tableRows += tableRow
    }
    const table = tableStartTags + tableRows + tableClosingTag
    document.getElementById("json-token").innerHTML = table; // show the success message, in this case showing token    


    } catch (error) {
        document.getElementById("bad-credential").innerHTML = "Username and Password do not match"; // show the failure message
    }
}); // see all user method ends here


