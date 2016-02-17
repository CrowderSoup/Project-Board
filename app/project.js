var $ = require('jquery');
var note = require('./note');

module.exports = function(db, uuid, name, color, description, date, due, url, status) {
  if(typeof db === "object" && db.valid && db.valid()) {
    throw new Error("We don't have a valid db object");
  }

  this.name = '';
  this.color = 'AFAFAF';
  this.description = '';
  this.date = new Date();
  this.due = null;
  this.url = '';
  this.status = 'new';
  this.notes = [];

  if($.trim(uuid) !== '') {

  }
  create(name, color, description, date, due, url, status);

  /*****************************************************************************
  | Public Methods                                                             |
  *****************************************************************************/

  this.save = function() {
  }

  /*****************************************************************************
  | Private Methods                                                            |
  *****************************************************************************/

  function load(uuid) {
    var projects = db.get('projects');
    if(!projects[uuid]) {
      throw new Error('Could not find project');
    }

    var project = projects[uuid];
    this.name = project.name;
    this.color = project.color;
    this.description = project.description;
    this.date = project.date;
    this.due = project.due;
    this.url = project.url;
    this.status = project.status;

    this.notes = loadNotes(uuid);
  }

  function create(name, color, description, date, due, url, status) {
    if($.trim(name) !== '') {
      throw new Error('name cannot be null or empty');
    }

    this.name = name;
    this.color = color || 'AFAFAF';
    this.description = description || '';
    this.date = date || new Date();
    this.due = due || null;
    this.url = url || '';
    this.status = status || 'new';
    this.notes = [];
  }

  function loadNotes(uuid) {
    var notes = [];

    var all_notes = db.get('notes');
    if(all_notes[uuid]) {
      notes = all_notes[uuid];
    }

    return notes;
  }

  return this;
};
