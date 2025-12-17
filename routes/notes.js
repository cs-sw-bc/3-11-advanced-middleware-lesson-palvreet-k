import express from "express";

const router = express.Router();

// Fake data store
const notes = [
  { id: "1", title: "Grocery", body: "Buy milk" },
  { id: "2", title: "Workout", body: "Leg day" },
];

router.get("/", (req, res) => {
  res.json(notes);
});

// sync route to get note by id
router.get("/:id", (req, res, next) => {
  const note = notes.find(n => n.id === req.params.id);

  if (!note) {
    const err = new Error("Note not found");
    err.status = 404;
    return next(err);
  }

  res.json(note);
});

//async function to simulate DB call

function getNoteFromDB(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notes = [
        { id: "1", title: "Grocery", body: "Buy milk" },
        { id: "2", title: "Workout", body: "Leg day" },
      ];

      const note = notes.find(n => n.id === id);

      if (!note) {
        reject(new Error("Note not found in database"));
      } else {
        resolve(note);
      }
    }, 1000);
  });
}

router.get("/async-notes/:id", async (req, res,next) => {
  try {
    const note = await getNoteFromDB(req.params.id);
    //await notes.find({id:1});
    res.json(note);
  } catch (err) {
    err.status = 404;
    next(err);
  }
});

export default router;