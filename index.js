

// Core modules
const fs = require('fs');
const http = require('http');
const url = require('url');
// 3rd Party modules
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate')
////////////////////////////////////////////////////////////////////////
// FILES
///////////////////////////////////////////////////////////////////////
// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File has been written');

///////////////////////////////////////////////////////////////////////
// Non-blocking, asynchonous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR!');
//
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);
//
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written');
//       });
//     });
//   });
// });
// console.log('Will read file!');

///////////////////////////////////////////////////////////////////////
// SERVER

// Synchronous top level blocking code, will be read once
// and then not will not matter that it is blocking
// template files
// Defining the dir path for the templates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
// Parsing and returning data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// Slugify tabs to templates
const slugs = dataObj.map(el => slugify(el.productName, { lower: true}));
console.log(slugs);
// // Testing slugify
// console.log(slugify('Avocados', { lower: true }))
// end blocking code
// Creating server
const server = http.createServer((req, res) => {
// query for the pathway for the template FILES
// This const is set to equate the query to parse the url
// was required in the opening declarations
  const {
    query,
    pathname
  } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Products page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

    // Not found page
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(2000, '127.0.0.1', () => {
  console.log('Listening to requests on port 2000');
});
//test
