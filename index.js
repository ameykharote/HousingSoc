const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const memberData = JSON.parse(json);
//console.log(laptopData);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    //console.log(pathName);
    const id = url.parse(req.url, true).query.id;

    //Members overview
    if(pathName === '/home' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                
                const cardsOutput = memberData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                //console.log(cardsOutput);
                res.end(overviewOutput);
            });
        });
    } 
    
    //Member Details
    else if (pathName === '/member' && id < memberData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'});
        //res.end(`this is the laptop page for laptop ${id}`);
        
        fs.readFile(`${__dirname}/templates/template-member.html`, 'utf-8', (err, data) => {
            //console.log(data);
            const member = memberData[id];
            //console.log(laptop);
            const output = replaceTemplate(data, member);
            //console.log(output);
            res.end(output);
        });
    } 

    //
    else if ((/\.(jpg||jpeg||png||gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/png'});
            res.end(data);
        });
    }
    
    //URL not found
    else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('Not found');
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('listen for req');
});

function replaceTemplate(orginalHTML, member) {
    let output = orginalHTML.replace(/{%MEMBERNAME%}/g, member.memberName);
    output = output.replace(/{%IMAGE%}/g, member.image);
    output = output.replace(/{%BUILDINGNUMBER%}/g, member.buildingNumber);
    output = output.replace(/{%FLATNO%}/g, member.flatNo);
    output = output.replace(/{%RESIDENTSINCE%}/g, member.residentSince);
    output = output.replace(/{%DESCRIPTION%}/g, member.description);
    output = output.replace(/{%ID%}/g, member.id);
    return output;
}