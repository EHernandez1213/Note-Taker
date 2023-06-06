const fb = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');


fb.get('/', (req, res) =>
  readFromFile('./db/feedback.json').then((data) => res.json(JSON.parse(data)))
);


fb.post('/', (req, res) => {

  const { email, feedbackType, feedback } = req.body;

  if (email && feedbackType && feedback) {

    const newFeedback = {
      email,
      feedbackType,
      feedback,
      feedback_id: uuidv4(),
    };

    readAndAppend(newFeedback, './db/feedback.json');

    const response = {
      status: 'success',
      body: newFeedback,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

module.exports = fb;
