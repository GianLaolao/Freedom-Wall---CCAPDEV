
function change(pass, check, img) {
  if (check.checked) {
    img.css("background-position", "-3.5px 52px");
    pass.attr("type","text")
  } else {
    img.css("background-position", "42px 52px");
    pass.attr("type","password")
  }
}

$("#pass-vis").click(function() {
  var pass = $("#password");
  var img = $("#pass-eye");
    
  change(pass, this, img);
})

$("#b-pass").click(function() {
  var pass = $("#password");
  var img = $("#cust-bpass");
  
  change(pass, this, img);
});

$("#b-confpass").click(function() {
  var pass = $("#conf_password");
  var img = $("#cust-bconf");
  
  change(pass, this, img);
});

function thumbClick(icon, id, type, name) {
  var color = icon.css('fill');

  if (color === 'rgb(255, 255, 255)') {
    icon.css('fill', '#00703C');
    switch (type) {
      case 0:
        sessionStorage.setItem('scrollPosition', window.scrollY);
        window.location.href = `/post/${id}/remove?icon=${name}`;
        break;
      case 1:
        window.location.href = `/post/${id}/add?icon=${name}`;
        break;
    }
  }
  else {
    icon.css('fill', 'white');
    switch (type) {
      case 0:
        sessionStorage.setItem('scrollPosition', window.scrollY);
        window.location.href = `/post/${id}/add?icon=${name}`;
        break;
      case 1:
        window.location.href = `/post/${id}/remove?icon=${name}`;
        break;
    }
  }
  return;
}

$(".forum-container").on('click', '.thumb-up', function() {
    var div = $(this).closest('.forum');
    var downVoteIcon = div.find('.thumb-down').find('path');
    var upVoteIcon = $(this).find('path');
    var id = div.attr('id');

    if(downVoteIcon.css('fill') === 'rgb(255, 255, 255)') {
      thumbClick(downVoteIcon, id, 0, "down")
    }
    thumbClick(upVoteIcon, id, 0, "up");
  
});

$(".forum-container").on('click', ".thumb-down",function() {
  var div = $(this).closest('.forum');
  var downVoteIcon = $(this).find('path'); 
  var upVoteIcon = div.find('.thumb-up path');
  var id = div.attr('id');

  if (upVoteIcon.css('fill') === 'rgb(255, 255, 255)') {
    thumbClick(upVoteIcon, id, 0, "up")
  }
  thumbClick(downVoteIcon, id, 0, "down");
});

    
$(".like").click(function() {
  var icon = $("#like-icon").find('path');
  var postId = $(this).closest('.post').attr('id');
  var dislikeIcon = $("#dislike-icon").find('path');

  if(dislikeIcon.css('fill') === 'rgb(0, 112, 60)') {
    thumbClick(dislikeIcon, postId, 1, "down")
  }
  thumbClick(icon, postId, 1, "up");
});

$(".dislike").click(function() {
  var icon = $("#dislike-icon").find('path');
  var postId = $(this).closest('.post').attr('id');
  var likeIcon = $("#like-icon").find('path');
  
  if(likeIcon.css('fill') === 'rgb(0, 112, 60)') {
    thumbClick(likeIcon, postId, 1, "up");
  }
  thumbClick(icon, postId, 1, "down");
});

$("#menu-icon").click(function() {
  var menu = $(".menu");

  if (menu.css('display') == "none") {
    menu.css('display', 'flex');
  }
  else {
    menu.css('display', 'none');
  }
});

$("#post_btn").on('submit', function() {
  
   alert("Successfully posted.")
});

$("#o-pass").click(function() {
  var pass = $("#old-password");
  var img = $("#cust-opass");
  
  change(pass, this, img);
}); 

$("#n-pass").click(function() {
  var pass = $("#new-password");
  var img = $("#cust-npass");
  
  change(pass, this, img);
}); 

$("#c-pass").click(function() {
  var pass = $("#new-conf-password");
  var img = $("#cust-cpass");
  
  change(pass, this, img);
}); 

$('.delete-post').on('click', function() {

  var body = $(this).closest('.content');
  var buttons = $('.content button');

  buttons.prop("disabled", true);
  body.addClass('blurred');
  $('.delete-post-dialogue').css('display', 'flex');
});

$('#cancel-button').on('click', function() {

  var body = $(this).closest('.content');
  var buttons = $('.content button');

  buttons.prop("disabled", false);
  body.addClass('blurred');

  $('.delete-post-dialogue').css('display', 'none');
  $('.delete-comment-dialogue').css('display', 'none');
})

$('.delete-comm').on('click', function() {

  var body = $(this).closest('.content');
  var buttons = $('.content button');
  var commentId = $(this).closest('.comment-post').attr('id');
  var postId = $('.post').attr('id');

  buttons.prop("disabled", true);
  body.addClass('blurred');
  $('.delete-comment-dialogue').css('display', 'flex');
  $('.delete-comment-dialogue .buttons').attr('action', '/post/'+postId+'/comment/'+commentId+'/delete')
});

$('.tags').on('click', '.tag-cont', function(){

  var tag = $(this).closest('.tag-cont');
   
  $('.tags .tag-cont').css('background-color', 'white');

  tag.css('background-color', '#00703C');
});

$('#delete_acct').on('click', function() {

  var body = $(this).closest('.page');
  var buttons = $('.pfp-button');

  buttons.prop("disabled", true);
  body.addClass('blurred');

  $('.delete-acct-dialogue').css('display', 'flex');
})

$('#signup-btn').on('click', function(e) {

    e.preventDefault();
    var password = $('#password').val();
    var confirmPassword = $('#conf_password').val();

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
    } else if (password.length < 8) {
        alert("Password should be atleast 8 characters");
    }
    else {
        $('#signup_form').submit();
    }
});

$('#change-btn').on('click', function(e) {

  e.preventDefault();
  var newPass = $('#new-password').val();
  var confPass = $('#new-conf-password').val();

  if (newPass !== confPass) {
    alert("Passwords do not match!");
  } else if (newPass.length < 8) {
      alert("Password should be atleast 8 characters");
  }
  else {
      $('#settings-form').submit();
  }
});

$(".edit-comm").on('click', function() {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

$(".m-log-out").on('click', function() {
  $("#logout_form").submit();
});



