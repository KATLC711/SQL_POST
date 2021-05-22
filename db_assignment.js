var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3636);



app.get('/', function (req, res, next) {
  var context = {};
  mysql.pool.query('SELECT * FROM exercise', function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    query_result = []
    for (i = 0; i < rows.length; i++) {

      if (rows[i].reps == -1) {
        var reps = ""
      } else {
        var reps = rows[i].reps
      }


      if (rows[i].weight == -1) {
        var weight = ""
      } else {
        var weight = rows[i].weight
      }

      if (rows[i].unit == "na") {
        var unit = ""
      } else {
        var unit = rows[i].unit
      }


      if (getFormattedDate(rows[i].date) == '12-31-9999') {
        var date = ""
      } else {
        var date = rows[i].getFormattedDate(rows[i].date)
      }

      query_result.push({ 'id': rows[i].id, 'name': rows[i].name, 'reps': reps, 'weight': weight, 'date': date, 'unit': unit })
    }
    context.results = query_result;
    res.render("home", context)
  });
});





app.post('/', function (req, res, next) {




  if (req.body.typ == "Insert") {
    console.log("Insert")
    mysql.pool.query("INSERT INTO exercise (`name`,`reps`,`weight`,`date`,`unit`) VALUES (?,?,?,?,?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit], function (err, result) {
      if (err) {
        next(err);
        return;
      }

      var context = {};
      mysql.pool.query('SELECT * FROM exercise', function (err, rows, fields) {
        if (err) {
          next(err);
          return;
        }
        query_result = []
        for (i = 0; i < rows.length; i++) {
          query_result.push({ 'id': rows[i].id, 'name': rows[i].name, 'reps': rows[i].reps, 'weight': rows[i].weight, 'date': getFormattedDate(rows[i].date), 'unit': rows[i].unit })
        }
        context.results = JSON.stringify(query_result);
        res.send(context);

      });



    });
  }


  if (req.body.typ == "Delete") {
    console.log("Delete")
    mysql.pool.query("DELETE FROM exercise WHERE id=?", [req.body.id], function (err, result) {
      if (err) {
        next(err);
        return;
      }


      var context = {};
      mysql.pool.query('SELECT * FROM exercise', function (err, rows, fields) {
        if (err) {
          next(err);
          return;
        }
        query_result = []
        for (i = 0; i < rows.length; i++) {
          query_result.push({ 'id': rows[i].id, 'name': rows[i].name, 'reps': rows[i].reps, 'weight': rows[i].weight, 'date': getFormattedDate(rows[i].date), 'unit': rows[i].unit })
        }
        context.results = JSON.stringify(query_result);
        res.send(context);

      });

    });
  }




  if (req.body.typ == "Edit_Data_request") {

  }

});











app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});







function getFormattedDateYMR(date_unformmated) {

  var date = new Date(date_unformmated)

  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  final = year + '-' + month + '-' + day;

  return final.toString();
}



function getFormattedDate(date_unformmated) {

  var date = new Date(date_unformmated)

  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  final = month + '-' + day + '-' + year;

  return final.toString();
}
