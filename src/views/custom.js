$(document).ready(function() {
  console.log('dom ready')
  var socket = io();
  $('#form').submit(function(e){
    console.log('submit triggered')
    e.preventDefault()
    socket.emit('chat message', $('#m').val());
    console.log('chat emitted: ' + $('#m').val() )
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
})


function posttobackend(fbtoken, fbid) {
  console.log('init backend post')
  $.post('/api', {token: fbtoken, uid: fbid}, function(result, status){
    console.log('Post done, status: ' + status)
    console.log('Data: ' + result)
  })
  console.log('post triggeed!')
}


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
      getPhoto();
      // window.location.href = "http://localhost:3000/chat";
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
      // window.top.location = "localhost:3000/chat";
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1032794393423272',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.6' // use graph api version 2.5
  });




    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    // window.top.location = "localhost:3000/chat";
  });

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    console.log(uid)
    var accessToken = response.authResponse.accessToken;
    console.log(accessToken)
    // Post to backend
    posttobackend(accessToken, uid)
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
  }
});



  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
    });
  }

  function getPhoto() {
    console.log('Fetching your pictures');
    FB.api('/me/picture?height=320', function(response) {
      console.log( response)
      $('#pictures').attr('src', response.data.url )
    });
  }

//   js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=1032794393423272";
