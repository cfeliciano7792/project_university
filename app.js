// # Citation for app.js:
// # Date: 8/1/2024
// # Copied from the cs340 Node Starter guide:
// # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


/*
    SETUP
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT        = 7792;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/
app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM Departments;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

    app.post('/add-department-form', function(req, res) {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Log the data to verify it is coming through correctly
        console.log(data);
    
        // Capture NULL values
        let budget = parseInt(data['input-budget']);
        if (isNaN(budget)) {
            budget = 'NULL';
        }
    
        // Create the query and run it on the database
        let query1 = `INSERT INTO Departments (name, budget) VALUES ('${data['input-name']}', ${budget})`;
    
        db.pool.query(query1, function(error, rows, fields) {
            // Check to see if there was an error
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Departments and
                // presents it on the screen
                res.redirect('/');
            }
        });
    });

    app.get('/academicAdvisors', function(req, res) {
        let query2 = "SELECT * FROM AcademicAdvisors;";               // Define our query

        db.pool.query(query2, function(error, rows, fields){    // Execute the query

            res.render('academicAdvisors', {data: rows});                  
        }) 
    });

    // Code that handles adding a new advisor to the database. Adapted from node starter code
    app.post('/add-advisor-form', function(req, res) {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Log the data to verify it is coming through correctly
        console.log(data);
    
        // Capture NULL values
        let salary = parseInt(data['input-salary']);
        if (isNaN(salary)) {
            budget = 0;
        }
    
        // Create the query and run it on the database
        let query1 = `INSERT INTO AcademicAdvisors (name, salary) VALUES ('${data['input-name']}', ${salary})`;
    
        db.pool.query(query1, function(error, rows, fields) {
            // Check to see if there was an error
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Departments and
                // presents it on the screen
                res.redirect('/academicAdvisors');
            }
        });
    });
    
// reads courses tables
    app.get('/courses', function(req, res) {
        let query3 = "SELECT * FROM Courses;";               // Define our query

        let query4 = "SELECT * FROM Departments;";

        let query5 = "SELECT * FROM Faculty;";

        // Run query3
        db.pool.query(query3, function(error, rows, fields){    // Execute the query

            let courses = rows;

             // Run query4
            db.pool.query(query4, (error, rows, fields) => {

            let departments = rows;

            db.pool.query(query5, (error, rows, fields) => {

                let faculty = rows;
            res.render('courses', {data: courses, departments: departments, faculty:faculty});                  // Render the index.hbs file, and also send the renderer
            }) 
        })
    })
});

// Code that handles adding a new course to the database. Adapted from node starter code
    app.post('/add-course-form', function(req, res) {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Log the data to verify it is coming through correctly
        console.log(data);
    
        // Capture NULL values
        let credits = parseInt(data['input-credits']);
        if (isNaN(credits)) {
            credits = 0;
        }

        let departmentID = parseInt(data['input-departmentID']);
    
    let facultyID = parseInt(data['input-facultyID']);
        if (isNaN(facultyID)) {
            facultyID = 'NULL';  
        }
    
        // Create the query and run it on the database
        let query1 = `INSERT INTO Courses (title, credits, departmentID, facultyID) VALUES ('${data['input-title']}', ${credits}, ${departmentID}, ${facultyID})`;
    
        db.pool.query(query1, function(error, rows, fields) {
            // Check to see if there was an error
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Departments and
                // presents it on the screen
                res.redirect('/courses');
            }
        });
    });

// -----------------------Handle Deletes---------------------------------------------------
// Delete course
app.post('/delete-course/:courseID', function(req, res) {
    let courseID = req.params.courseID;

    let query = `DELETE FROM Courses WHERE courseID = ${courseID}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/courses');
        }
    });
});

// delete department
app.post('/delete-department/:departmentID', function(req, res) {
    let departmentID = req.params.departmentID;

    let query = `DELETE FROM Departments WHERE departmentID = ${departmentID}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/');
        }
    });
});

// -----------------------Handle Updates---------------------------------------------------

// update course
app.post('/update-course', function(req, res) {
    let data = req.body;

    // Capture NULL values
    let credits = parseInt(data['credits']);
    if (isNaN(credits)) {
        credits = 0;
    }

    let departmentID = parseInt(data['departmentID']);
    let facultyID = parseInt(data['facultyID']);
    if (isNaN(facultyID)) {
        facultyID = 'NULL';  
    }

    // Create the query and run it on the database
    let query = `UPDATE Courses SET title = '${data['title']}', credits = ${credits}, departmentID = ${departmentID}, facultyID = ${facultyID} WHERE courseID = ${data['courseID']}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/courses');
        }
    });
});


// update department
app.post('/update-department', function(req, res) {
    let data = req.body;
    let budget = parseInt(data['budget']);

    // Create the query and run it on the database
    let query = `UPDATE Departments SET name = '${data['name']}', budget = ${budget} WHERE departmentID = ${data['departmentID']}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/');
        }
    });
});

// update advisor
app.post('/update-advisor', function(req, res) {
    let data = req.body;
    let salary = parseInt(data['salary']);

    // Create the query and run it on the database
    let query = `UPDATE AcademicAdvisors SET name = '${data['name']}', salary = ${salary} WHERE advisorID = ${data['advisorID']}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/academicAdvisors');
        }
    });
});


    /*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});