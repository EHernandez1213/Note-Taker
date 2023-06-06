const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');
const fs = require('fs');


router.get('/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data))
  );
});


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

module.exports = router;
