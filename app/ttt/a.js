const http = require('http');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = 9010;

fs.readFile('index.html', (err, html) => {
	if (err){
		throw err;
	}
	
	const server = http.createServer((req, res) => {
		
		//console.log("aaa", req);
		res.statusCode = 200;
		res.setHeader('Content-type', 'text/html');
		res.write(html);
	    res.write('fghfhfgj');
		res.end();
	}); 

	server.listen(port, hostname, () =>{
		console.log('Server started on port ' + port);
	});
});