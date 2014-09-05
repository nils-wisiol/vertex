// init express framework
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var vertex = require('./vertex');

// promises
var Q = require('q');

// Body parsing
app.use(bodyParser.json());

// start server
var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});

// function to report problems to the client
// this follows https://tools.ietf.org/html/draft-nottingham-http-problem-05
function problem(res, information) {
	res.set({
		'Content-Type': 'application/problem+json',
		'Content-Language': 'en',
	});
	res.status(403);
	res.send(information);
	return;
}

app.post('/app', function(req, res){
	res.send(vertex.addNode(req.body));
});
