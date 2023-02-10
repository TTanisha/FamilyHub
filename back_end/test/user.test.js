const user = require('../models/userModel');
const app = require('../app');
let supertest = require('supertest');
let request = supertest(app);
const mongoose = require('mongoose');
require("dotenv").config({path: "config.env"}); // load environment variables



beforeAll( async ()=> {
    //jest.useFakeTimers('legacy')
    
    // Database connection
    const DB = process.env.FAMILYHUB_DB_URI;
    console.log(DB);
    mongoose.set('strictQuery', false);// Preparation for deprecation 
    const connectionOptions = {
        // Required due to changes in the MongoDB Node.js driver
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }

    mongoose.connect(DB, connectionOptions).then(
        () => {console.log("Successfully connected to MongoDB.")},
        err => {console.error("Unable to connect to MongoDB.", err.message)}
    );
})


afterAll( async () => {
    //make we have deleted the test user from the database
    await user.findOneAndDelete({username: 'TestUser'})
    await mongoose.connection.close();
})




describe("test1", () => {
    test('1 should be 1 ', () => {
      expect(1).toBe(1);
    });
});



/* IN DEVELOPMENT*/

describe('Enter new User',() =>{
    test('User has provided all details correct',async () => {
        const response = await request.post('/api/users/registerUser').send({
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            eMail: 'TestEmail@com.ca',
            username: 'TestUser',
            password: 'Test123@',
            birthday: "31/01/2001",
        }) 
        expect(response.statusCode).toBe(200);
        await user.findOneAndDelete({username: 'TestUser'});    
    });
} )


