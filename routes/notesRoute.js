const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');
const fs = require('fs');

// GET Route for retrieving diagnostic information
router.get('/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data))
  );
});

// POST Route for a error logging
router.post('/notes', (req, res) => {
  console.log(req.body);

  const { isValid, text, title } = req.body;

  const payload = {
    title,
    id: uuidv4(),
    text
  };
  console.log(payload);
  if (!isValid) {
    readAndAppend(payload, './db/db.json');
    res.json(`Diagnostic information added 🔧`);
  } else {
    res.json({
      message: 'Object is valid, not logging. Check front end implementation',
    });
  }
});
router.delete("/notes/:id", (req, res) => {
  fs.readFile("db/db.json", (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);
    let notes = json.filter((note) => note.id !== req.params.id);
    console.log(notes);
    fs.writeFile("db/db.json", JSON.stringify(notes), function (err) {
      if (err) throw err;
      res.redirect("/notes");
    });
  });
});

// router.delete('/:id', (req, res) => {
//   const noteId = req.params.id;
// readFromFile('./db/db.json')
//   .then((data) => JSON.parse(data))
//   .then((json) => {
//     // Make a new array of all tips except the one with the ID provided in the URL
//     const result = json.filter((note) => note.id != req.params.noteId);
//     console.log(result)
//     // Save that array to the filesystem
//     writeToFile('./db/db.json', result);

//     // Respond to the DELETE request
//     res.json(`Item ${noteId} has been deleted 🗑️`);
//   });
//   fs.readFile('db/db.json', 'utf-8', (err, data) => {
//     let parseData = JSON.parse(data);
//     const result = parseData.filter((note) => note.id != req.params.id);
//     fs.writeFile('db/db.json', JSON.stringify(result), (err) => err ? console.log(err) : res.end())
//   })
// });
module.exports = router;
