const replaceTemplate = require("./modules/replaceTemplate")
const fs = require("fs")
const http = require("http")
const url = require("url")

//read template files
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
)

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
)

const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8")

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data)

//creating response and request calling system at server
const server = http.createServer((req, res) => {
  //retrieving data from the url obj
  /*
  http://127.0.0.1:5000/product?id=1
  pathname = /product
  search = ?id=1
  query = {id : 1}
  */
  const {query, pathname} = url.parse(req.url, true)

  if (pathname == "/" || pathname == "/overview") {
    //writeHead allows use to tell the browser what of file we are server
    res.writeHead(200, {
      "Content-type": "text/html",
    })
    console.log(req.url)

    //identify what you are serving
    const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("")
    //Outputing it us a string
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml)
    res.end(output)
  } else if (pathname == "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    })
    console.log(req.url)

    //id and outputing to the server
    //query for id returns a number id = 1
    const product = dataObj[query.id]

    const output = replaceTemplate(tempProduct, product)
    res.end(output)
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-head": "Hello world",
    })

    res.end(`<h1>page not found</h1>`)
  }
})

//setting up the server address
server.listen(5000, "127.0.0.1", () => {
  console.log("Listening to requests on port 5000")
})
