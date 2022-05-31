const express = require('express');
const app = new express();
var fs = require('fs');

function getType(originalUrl) {
  if (originalUrl.includes('svg')) {
    return "image/svg+xml"
  }
  return ""
}

app.use('*', (req, res, next) => {
  console.warn(111)
  let originalUrl = req.originalUrl;
  if (originalUrl === '/') {
    originalUrl = 'index.html';
  }
  originalUrl = originalUrl.split("?")[0];
  console.warn(originalUrl)
  fs.readFile('./out/' + originalUrl, (err, data) => {
    if (err) {
      next();
    } else {
      res.writeHead(200, {
        'Content-type': getType(originalUrl),
      });
      res.end(data)
    }
  })
});


app.use('*', (req, res, next) => {

  console.warn(222)
  console.warn(req.originalUrl);
  let originalUrl = req.originalUrl;
  originalUrl = originalUrl.split("?")[0];

  fs.readFile('./out/' + decodeURIComponent(originalUrl), (err, data) => {

    if (err) {
      next();
    } else {
      res.writeHead(200, {});
      res.end(data)
    }
  })
});


app.use('*', (req, res, next) => {
  console.warn(333)
  console.warn(req.originalUrl);
  let originalUrl = req.originalUrl;
  if (originalUrl === '/') {
    originalUrl = 'index.html';
  }
  originalUrl = originalUrl.split("?")[0];
  fs.readFile('./out/' + originalUrl + '.html', (err, data) => {
    if (err) {
      next();
    } else {
      res.writeHead(200, {});
      res.end(data)
    }
  })
});

app.use('*', (req, res, next) => {
  console.warn('444')
  console.warn(req.originalUrl);
  let originalUrl = req.originalUrl;
  originalUrl = originalUrl.split("?")[0];
  let arr = originalUrl.split("/");
  let url = "[organization]/" + arr[2];
  fs.readFile('./out/' + url + '.html', (err, data) => {
    if (err) {
      next();
    } else {
      res.writeHead(200, {});
      res.end(data)
    }
  })
});

app.listen(3001)
