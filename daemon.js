var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var glob = require("glob");
var app = express();

app.use(express.static('.'));
app.use('/get', express.static('./references'));
app.use(bodyParser.json());

const port = 3838;
app.listen(port);
console.log('listening on port ' + port);

app.get('/', function (req, res) {
	res.sendFile(path.resolve('./index.html'));

}).get('/filelist/:id', function (req, res) {
	var dir = './references/' + req.params.id;
	glob(dir + "/*.pdf", function (err, paths) {
		var files = paths.map(x => x = path.basename(x));
		res.json({"filelist": files});
	});
});
