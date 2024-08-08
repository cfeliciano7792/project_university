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



// code that handles reading the faculty table
app.get('/faculty', function(req, res) {
    let query1 = "SELECT * FROM Faculty;";               // Define our query

    let query2 = "SELECT * FROM Departments;";

    let query3 = "SELECT * FROM AcademicAdvisors;";

    // Run query3
    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        let faculty = rows;

         // Run query2
        db.pool.query(query2, (error, rows, fields) => {

        let departments = rows;

        db.pool.query(query3, (error, rows, fields) => {

            let advisor = rows;
        res.render('faculty', {data: faculty, departments: departments, advisor:advisor});                  // Render the index.hbs file, and also send the renderer
        }) 
    })
})
});

// Code that handles adding a new faculty member to the database. Adapted from node starter code
app.post('/add-faculty-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Log the data to verify it is coming through correctly
    console.log(data);

    let salary = parseInt(data['input-salary'])

    let departmentID = parseInt(data['input-departmentID']);

    let advisorID = parseInt(data['input-advisorID']);

    // Create the query and run it on the database
    let query1 = `INSERT INTO Faculty (name, salary, departmentID, advisorID) VALUES ('${data['input-name']}', ${salary}, ${departmentID}, ${advisorID})`;

    db.pool.query(query1, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Departments and
            // presents it on the screen
            res.redirect('/faculty');
        }
    });
});


// code that handles reading the students table
app.get('/students', function(req, res) {
    let query1 = "SELECT * FROM Students;";               // Define our query

    let query2 = "SELECT * FROM Departments;";

    let query3 = "SELECT * FROM AcademicAdvisors;";

    // Run query3
    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        let student = rows;

         // Run query2
        db.pool.query(query2, (error, rows, fields) => {

        let departments = rows;

        db.pool.query(query3, (error, rows, fields) => {

            let advisor = rows;
        res.render('students', {data: student, departments: departments, advisor:advisor});                  // Render the index.hbs file, and also send the renderer
        }) 
    })
})
});

// Code that handles adding a new student to the database. Adapted from node starter code
app.post('/add-student-form', function(req, res) {
    let data = req.body;

    console.log('Received data:', data);

    let dateOfBirth = new Date(data['input-dateOfBirth']);
    let formattedDate = `${dateOfBirth.getFullYear()}-${('0' + (dateOfBirth.getMonth() + 1)).slice(-2)}-${('0' + dateOfBirth.getDate()).slice(-2)}`;

    let gpa = parseFloat(data['input-gpa']) || null;
    let isActive = parseInt(data['input-isActive']) || 0;
    let departmentID = parseInt(data['input-departmentID']) || null;
    let advisorID = parseInt(data['input-advisorID']) || null;

    let query = `INSERT INTO Students (name, dateOfBirth, gpa, isActive, departmentID, advisorID) VALUES ('${data['input-name']}', '${formattedDate}', ${gpa}, ${isActive}, ${departmentID || 'NULL'}, ${advisorID})`;

    db.pool.query(query, [data['input-name'], formattedDate, gpa, isActive, departmentID, advisorID], function(error) {
        if (error) {
            console.error('Database error:', error);
            return res.sendStatus(400);
        }
        res.redirect('/students');
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

// delete advisor
app.post('/delete-advisor/:advisorID', function(req, res) {
    let advisorID = req.params.advisorID;

    let query = `DELETE FROM AcademicAdvisors WHERE advisorID = ${advisorID}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/academicAdvisors');
        }
    });
});

// delete faculty
app.post('/delete-faculty/:facultyID', function(req, res) {
    let facultyID = req.params.facultyID;

    let query = `DELETE FROM Faculty WHERE facultyID = ${facultyID}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/faculty');
        }
    });
});

// delete student
app.post('/delete-student/:studentID', function(req, res) {
    let studentID = req.params.studentID;

    let query = `DELETE FROM Students WHERE studentID = ${studentID}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/students');
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

// update faculty
app.post('/update-faculty', function(req, res) {
    let data = req.body;

    // Capture NULL values
    let salary = parseInt(data['salary']);

    let departmentID = parseInt(data['departmentID']);
    let advisorID = parseInt(data['advisorID']);

    // Create the query and run it on the database
    let query = `UPDATE Faculty SET name = '${data['name']}', salary = ${salary}, departmentID = ${departmentID}, advisorID = ${advisorID} WHERE facultyID = ${data['facultyID']}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/faculty');
        }
    });
});



    /*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});