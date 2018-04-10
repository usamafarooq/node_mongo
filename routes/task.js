var Note = require('../models/model.js');
var moment = require('moment');

exports.list = function(req, res) {
	// req.getConnection(function(err,connection) {
	// 	var query = connection.query('select *,DATE_FORMAT(date,"%Y-%m-%d") AS date from task', function(err,rows) {
	// 		if (err) {
	// 			console.log("Error Selecting : %s", err);
	// 		}
	// 		res.render('task', {page_title:"task",data:rows});
	// 	});
	// });
	Note.find()
    .then(notes => {
    	res.render('task', {page_title:"task",data:notes});
        //res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

exports.add = function(req, res) {
	res.render('add_task', {page_title:"Add Task"});
};

exports.save = function(req, res) {
	var input = JSON.parse(JSON.stringify(req.body));

	// req.getConnection(function(err,connection) {
	// 	var data = {
	// 		name : input.name,
	// 		date : input.date,
	// 		type : input.type,
	// 	};
	// 	var query = connection.query("INSERT INTO task set ?", data, function(err, rows) {
	// 		if (err) {
	// 			console.log("Error inserting : %s", err);
	// 		}
	// 		res.redirect('/');
	// 	})
	// })

	const note = new Note({
        name : input.name,
		date : input.date,
		type : input.type,
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.redirect('/');
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

exports.edit = function(req, res) {
	console.log(req.params)
	var id = req.params.id;
	// req.getConnection(function(err,connection) {
	// 	var query = connection.query('select *,DATE_FORMAT(date,"%Y-%m-%d") AS date from task where id = ?',[id],function(err,rows) {
	// 		if (err) {
	// 			console.log("Error Selecting : %s", err);
	// 		}
	// 		res.render('edit_task', {page_title:"edit task",data:rows});
	// 	})
	// })
	Note.findOne({_id: id}, function(err, document) {
	  res.render('edit_task', {page_title:"edit task",data:document,moment:moment});
	});
	// Note.findById(id)
 //    .then(note => {
 //        if(!note) {
 //            return res.status(404).send({
 //                message: "Note not found with id " + id
 //            });            
 //        }
 //        console.log(notes)
 //        res.render('edit_task', {page_title:"edit task",data:note});
 //        //res.send(note);
 //    }).catch(err => {
 //        if(err.kind === 'ObjectId') {
 //            return res.status(404).send({
 //                message: "Note not found with id " + id
 //            });                
 //        }
 //        return res.status(500).send({
 //            message: "Error retrieving note with id " + id
 //        });
 //    });
}

exports.save_edit = function(req, res) {
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
	// req.getConnection(function(err,connection) {
	// 	var data = {
	// 		name : input.name,
	// 		date : input.date,
	// 		type : input.type,
	// 	};
	// 	connection.query('UPDATE task set ? WHERE id = ?',[data,id],function(err,rows) {
	// 		if (err) {
	// 			console.log("Error updating : %s", err);
	// 		}
	// 		res.redirect('/');
	// 	})
	// })
	Note.findByIdAndUpdate(id, {
        name : input.name,
		date : input.date,
		type : input.type,
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.redirect('/');
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.noteId
        });
    });
}

exports.delete_customer = function(req, res) {
	var id = req.params.id;
	// req.getConnection(function(err,connection) {
	// 	connection.query('DELETE FROM task where id = ?',[id],function(err,rows) {
	// 		if (err) {
	// 			console.log("Error deleting : %s", err);
	// 		}
	// 		res.redirect('/');
	// 	})
	// })
	Note.findByIdAndRemove(id)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.redirect('/');
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });
}