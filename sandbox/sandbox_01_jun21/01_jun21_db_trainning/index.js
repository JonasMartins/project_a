(async () => {
    const db = require("./db");
    console.log('Começou!');
 
    console.log('SELECT * FROM USERS');
    const users = await db.selectUsers();
    console.log(users);
})();
