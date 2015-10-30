var Profile = require("./profile.js");
var querystring = require("querystring");
var renderer = require("./renderer.js");

var commonHeaders = {'Content-Type': 'text/html'}
//handle http route GET / and POST / i.e. Home
function home (request, response) {
  if(request.url === "/") {
    if(request.method.toLowerCase() === "get") {
      //show search
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);
    renderer.view("search", {}, response);
    renderer.view('footer', {}, response);
    response.end();
    } else {

     // if url == "/" && POST
     //get the post data from body

      request.on("data", function(postBody) {
        var query = querystring.parse(postBody.toString());
        //redirect to /:username
        response.writeHead(303, {"Location": "/" + query.username });
        response.end();
      });
     //extract the username
     //redirect to /:username
    }
}
}
  function user(request, response) {
    var username = request.url.replace("/","");
    if(username.length > 0) {
     response.writeHead(200, commonHeaders);
     renderer.view("header", {}, response);
    //get json from Treehouse
    var studentProfile = new Profile(username);
      //on "end"
      studentProfile.on("end", function(profileJSON) {
        //show profile

        //Store the values which we need
        var values = {
          avatarURL: profileJSON.gravatar_url,
          username: profileJSON.profile_name,
          badges: profileJSON.badges.length,
          javascriptPoints: profileJSON.points.JavaScript
        }

      // simple response
      renderer.view("profile", values, response);
      renderer.view('footer', {}, response);
      response.end();
    });
      //On "error"
      studentProfile.on("error", function(error) {
        //show error
        renderer.view("error", {errorMessage: error.message}, response);
        renderer.view("search", {}, response);
        renderer.view('footer', {}, response);
        response.end();
      });
    }
  }
    module.exports.home = home;
    module.exports.user = user;


