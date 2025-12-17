import express from "express";
import notesRoute from "./routes/notes.js"

const app = express();

//1. Add a global middleware
app.use((req, res, next) => {
  console.log("Request received in global middleware");
  next();
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello" });
});

//2. Throw an error using new Error
// We are just throwinh a dummy error to see how errors look scary
app.get("/simulate-error", (req, res) => {
  throw new Error("Simulating dummy error occurred!"); // throw throws error to the top level (browser/app level)
});

//3. Throw an error with route-specific middleware function
// throw an error graceful using next()
app.get("/crash", (req, res, next) => {
  const alert =  new Error("Don't access this route!");
  alert.status = 401; // internal server error- bad coding
  next(alert); // we are passing alert to next function that we will add a function that will handle this error and make it look less scary
});



app.use("/notes",notesRoute);

//4. Route not found middleware function (like random endpoint entered in browser))
// should be added after all the routes, before error middleware

app.use((req, res, next) => {
  const error = new Error("We don't have this route!");
  error.status = 404; //Not found
  next(error);
});

//5. Error middleware function - 4 parameters
// It is always the last middleware function that will handle all the errors passed to next()
app.use((err, req, res, next) => {
// Status code: 400, 500, 401, 403
  const statusCode = err.status || 500; // either use the status passed from next or default to 500
  // JSON response
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: err.message || "Internal Server Error"
    }
  });
});

// try accessing both the routes /simulate-error and /crash to see how errors are handled now


app.listen(3000, () => console.log("Server running on http://localhost:3000"));