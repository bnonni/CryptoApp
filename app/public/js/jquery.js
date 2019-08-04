/*jshint esversion: 6 */

/**
 * jQuery Setup
 */
  var jsdom = require("jsdom");
  app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
  const { JSDOM } = jsdom;
  const { window } = new JSDOM();
  var $ = require("jquery")(window);
  const { document } = (new JSDOM("")).window;
  global.document = document;
  $(document).ready(() => {
    console.log("Test!");
    $(".ETH").text("Hello World!");
  });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());