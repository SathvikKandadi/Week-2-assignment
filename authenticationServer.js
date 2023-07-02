/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

let users=[];
let hashMap={};
let check={};

app.use(bodyParser.json());

// app.get('/',(req,res)=>{
//   res.send("Hello World");
// })

app.post('/signup',(req,res)=>{
  // let username=req.body.username;
  let email=req.body.email;
  let password=req.body.password;
  let firstName=req.body.firstName;
  let lastName=req.body.lastName;
  let id=Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
  if(email in hashMap)
  {
    res.status(404).send('Email already exists');
  }
  else
  {
    hashMap[email]=id;
    check[email]=password;
    // console.log(hashMap);
    // console.log(check);
    let user={
      // username:username,
      email:email,
      password:password,
      firstName:firstName,
      lastName:lastName,
      id:id
    }
    users.push(user);
    let data=JSON.stringify(users);
    res.status(201).send('Signup successful');
    // console.clear();
    // console.log(data);
  }
})

app.post('/login',(req,res)=>{
  let email=req.body.email;
  let password=req.body.password;
  if(email in hashMap && check[email]==password)
  {
    for(let i=0;i<users.length;i++)
    {
      if(users[i].email==email)
      {
        let firstName=users[i].firstName;
        let lastName=users[i].lastName;
        let id=users[i].id;
        
        let obj={
          firstName:firstName,
          lastName:lastName,
          id:id,
          email:email
        }
        res.send(obj);
      }
    }
    // res.send("Login Sucessful");
  }
  else
  {
    res.status(401).send("Credential's are Invalid");
  }
})

app.get('/data',(req,res)=>{
  let email=req.headers.email;
  let password=req.headers.password;
  if(email in hashMap && check[email]==password)
  {
    // console.log(email);
    // console.log(password);
    // console.log(data.length);
    // console.log(email in hashMap);
    // console.log(check);
    // console.log(check[email]);
    // console.log(check[email] == password);
    let usersToReturn = [];
    for(let i=0;i<users.length;i++)
    {
      // console.log(users[i].email);
      // console.log(email);
        usersToReturn.push({
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        email: users[i].email
      });
      res.status(200).send({ users: usersToReturn });
    }
  }
  else
  {
    res.status(401).send("Unauthorized");
  }

})

app.use((req,res,next)=>{
  res.status(404).send("No such route found");
})

// app.listen(port,()=>{
//   console.log(`App started on port ${port}`);
// })

module.exports = app;
