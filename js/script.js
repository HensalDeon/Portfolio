// function btnClick(){
//     let btn;
//     var nameField = document.getElementById('NAME').value.trim();
//     var emailField = document.getElementById('eMAIL').value.trim();
//     var phoneField = document.getElementById('PHONE').value.trim();
//     var msgField = document.getElementById('MESSAGE').value.trim();

//     if(nameField === "" || emailField === "" || phoneField === "" || msgField === ""){
//         btn = false;
//         alert('All fields are mandatory !');
//     }else{
//         btn = true;
//     }

//     return btn;
// }
function btnClick(){
    let btn;
    var nameField = document.getElementById('NAME').value.trim();
    var emailField = document.getElementById('eMAIL').value.trim();
    var phoneField = document.getElementById('PHONE').value.trim();
    var msgField = document.getElementById('MESSAGE').value.trim();

    if(nameField === "" || emailField === "" || phoneField === "" || msgField === ""){
        btn = false;
        alert('All fields are mandatory !');
    }
    else if (!/^\d+$/.test(phoneField)) {
        alert('Phone number can only contain numbers');
        btn = false;
    }
    else if (!/^([a-zA-Z0-9\._]+)@([a-zA-Z0-9]+).([a-z]+).([a-z]+)?$/.test(emailField)) {
        alert('Please enter a valid email address');
        btn = false;
    }

    return btn;
}