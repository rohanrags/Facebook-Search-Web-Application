var app = angular.module('myscript', []);
app.controller('myCtrl', function($scope,$http,$timeout) {
    $scope.MainTableShow=true;
    $scope.main_table_headers=false;
    $scope.AlbumsAndPosts=false;
    $scope.previous_button_show=false;
    $scope.next_button_show=false;
    $scope.FavouritesTableShow=false;
    $scope.favourites_headers=false;
    
    $scope.MainTable_Progress_Bar=false;
    $scope.MainTable_Results=false;
    
    //Album and Post variables
    $scope.albums_progress_bar=false;
    $scope.posts_progress_bar=false;
    
    $scope.albums_result_show=false;
    $scope.search_facebook = search_facebook;
    
    $scope.fromFavoritesTab=false;
    
    $scope.Screen3='screen_out';

var keyword = null;
var current_type = 'user';

//Onload of Window
window.onload = function(){
    
    //setting current type value
    console.log("checking current type");
    geolocation();
}

$scope.close = function() {
   $('#keyword').tooltip('destroy');
}

$scope.clear = function(){
    console.log('In Clear');
    document.getElementById('keyword').value='';
    current_type='user';
    
    //For navbar values
    var ele = document.getElementById("type");
    for(i=0;i<6;i++) { 
        //console.log(ele.children[i]);
        ele.children[i].removeAttribute('class','active');
    } 
    document.getElementById("one").setAttribute('class','active');
    
    //Main table 
    $scope.values=[];
    $scope.main_table_headers=false;
    $scope.previous_button_show=false;
    $scope.next_button_show=false;
    
    $scope.MainTableShow=false;
    $scope.AlbumsAndPosts=false;
    $scope.FavouritesTableShow=false;
}

//Check Type Selected
$scope.check_type=function(type,event) {
    $scope.MainTableShow=true;
    $scope.AlbumsAndPosts=false;
    $scope.FavouritesTableShow=false;
    
    current_type = type;
    //$scope.setupColorOfSelected(current_type);
    console.log("Current type in check_type function -" + type);
    search_facebook();
}

$scope.changeColor=function(event){
    var elem = event.target.parentNode.parentNode;
    for(i=0;i<6;i++) { 
        //console.log($(elem.children[i]));
        $(elem.children[i]).removeClass('active');      
    }  
    $(event.target.parentNode).addClass('active');
    $(event.target).addClass('active');
}

//MainTable results-1
function search_facebook() {
    //moving albums and post div
    $scope.Screen3='screen_out';
    $timeout(function(){ $scope.MainTableShow=true;}, 600);
    $scope.fromFavoritesTab=false;
    
    
    //setting keyword value
    keyword = document.getElementById('keyword').value;
    if(keyword==null || keyword==''){
         $('#keyword').tooltip('show')
        return;
    }
    
    //Main table results off with progress bar on.
    $scope.MainTable_Results=false;
    $scope.MainTable_Progress_Bar=true;
    
    console.log("Inside search_fb - " + current_type + "--" + keyword);
    if(current_type && keyword) {
        var lat=null;
        var lng=null;
        //check if location values exist or not
        if(typeof $scope.crd !== 'undefined'){
            lat=$scope.crd.latitude;
            lng=$scope.crd.longitude;
        }
        
        $.ajax({ url: 'http://homework8-env.kamd3vgqsa.us-west-2.elasticbeanstalk.com/mysearch.php',
         data: {
             keyword: keyword,
             type:current_type,
             lat:lat,
             lng:lng
         },
         type: 'GET',
         success: function(output) {
             //console.log(output);
             create_main_table(output);
		  },error: function (output) {
                console.log(output);
            }
        });
        
//        $http({
//            method: 'GET',
//            url: 'mysearch.php',
//            params: {
//                eurl : encoded_url
//            }
//        }).then(function successCallback(response){
//            console.log(response);
//        }, function errorCallback(response){
//            console.log(response);
//        });
//        
//        console.log(output);
    }
}
//Used in search facebook function.
function getEvent(type) {
    switch (type) {
    case 'user':
        return 'Users';
    case 'page':
        return 'Pages';
    case 'event':
        return 'Events';
    case 'place':
        return 'Places';
    case 'group':
        return 'Groups';
    }
}

//MainTable results-2
function create_main_table(output){
    //progress bar switch off and main results on
    $scope.MainTable_Progress_Bar=false;
    $scope.MainTable_Results=true;
    
    $scope.main_table_headers=true;
    
    var table = document.getElementById("main_table");
    var jsonObject = JSON.parse(output);
    var data_length = jsonObject.data.length;
    $scope.values = [];
    console.log(jsonObject);
    
    console.log(data_length);
     if(data_length==0){
        $scope.main_table_headers=false;
    }
    
    //storing main_table values
    for(i=0;i<data_length;i++) {
        $scope.values.push(jsonObject.data[i]);
    }
    
    //for paging
    $scope.next_paging_values=null;
    $scope.previous_paging_values=null;
    
    //next and previous button values being set
    if(jsonObject.paging!=null) {
        $scope.next_paging_values = jsonObject.paging.next;
        $scope.previous_paging_values = jsonObject.paging.previous;
    }
    
    //showing of next and previous buttons
    if($scope.next_paging_values!=null && data_length>0) {
        $scope.next_button_show=true;
    } else {
        $scope.next_button_show=false;
    }
    
    if($scope.previous_paging_values!=null && data_length>0){
        $scope.previous_button_show=true;
    } else {
        $scope.previous_button_show=false;
    }
    
    $scope.$apply();
}

//Geolocation
function geolocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      $scope.crd = pos.coords;

      console.log('Your current position is:');
      console.log(`Latitude : ${$scope.crd.latitude}`);
      console.log(`Longitude: ${$scope.crd.longitude}`);
      console.log(`More or less ${$scope.crd.accuracy} meters.`);
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
}
    
//Pagination function
$scope.next = function(id){
    var url = null;
    if(id) {
        console.log('Next');
        if($scope.next_paging_values!=null) {
            url = $scope.next_paging_values;
        } 
    } else {
        console.log('Previous');
        if($scope.previous_paging_values!=null) {
            url = $scope.next_paging_values;
        }
    }
    $.ajax({
        url: 'http://homework8-env.kamd3vgqsa.us-west-2.elasticbeanstalk.com/mysearch.php',
        data: {paging_url: url},
        type: 'GET',
        success: function(output) {
            create_main_table(output);
       }
    });
}

//Star Functionality
$scope.star = function(obj){
    if(obj!=null){
        if(check_item_local_storage(obj.id)){
            return 'glyphicon-star gold';
        } else{
            return 'glyphicon-star-empty';
        }
    } else {
        return 'glyphicon-star-empty';
    }
}



//HTML5 Local Storage-1
$scope.local_storage = function(obj){
    if(check_item_local_storage(obj.id)){
        //item already in local storage
        remove_item_ls(obj.id);
    } else {
        //item not in local storage
        console.log(obj);
        obj.type=getEvent(current_type);
        console.log(obj);
        // Store
        localStorage.setItem(obj.id, JSON.stringify(obj));
    }
}


//HTML5 Local Storage-2
$scope.retrieve_local_storage = function(){
    $scope.MainTableShow=false;
    $scope.AlbumsAndPosts=false;
    $scope.FavouritesTableShow=true;
    $scope.favourites_headers=true;
    var table = document.getElementById("favourites_table");
    $scope.local_storage_values=[];
    var count=0;
    //storing main_table values
    for (var key in localStorage){
    $scope.local_storage_values.push(JSON.parse(localStorage.getItem(key)));
    }
    if($scope.local_storage_values.length==6){
        $scope.local_storage_length=0;
    } else{
        $scope.local_storage_length=1;
    }
    
    $scope.fromFavoritesTab=true;
}

//HTML5 Local Storage-3
$scope.remove_item_local_storage = function(id){
    console.log("removed item-"+id);
    localStorage.removeItem(id);
    $scope.retrieve_local_storage();
}

//HTML5 Local Storage-4
function remove_item_ls(id){
    console.log("removed item-"+id);
    localStorage.removeItem(id);
}

//HTML5 Local Storage-5
function check_item_local_storage(k) {
    for (var key in localStorage){
        if(k==key){
            return true;
        }
    }
    return false;
}
//function hide_mainTable_header(){
//    $scope.MainTableShow=false;
//    $scope.AlbumsAndPosts=true;
//    $scope.$apply();
//}



//Back Button
$scope.backButton = function() {
//    $scope.AlbumsAndPosts=false;
    $scope.Screen3='screen_out';
    $timeout(function(){ 
        console.log($scope.FavouritesTableShow);
        console.log($scope.favourites_headers);
        if($scope.fromFavoritesTab==true){
            $scope.retrieve_local_storage();
        }else{
            $scope.MainTableShow=true;
            $scope.FavouritesTableShow=false;
        }
        
    }, 600);
//$scope.MainTableShow=true;
    console.log("Clicked on Back button, Current Type - "+current_type);
}


//ALbums and Posts-1
$scope.getAlbumsAndPosts = function(obj){
    
    //hide_mainTable_header();if()
    
    $scope.MainTableShow=false;
    $scope.AlbumsAndPosts=true;
    $scope.FavouritesTableShow=false;
    $scope.Screen3='screen_in';
    
    //For album data and no data exist for ng-show
    $scope.albums_yes_data=false;
    $scope.albums_no_data=false;
    
    //For post data and no data exist for ng-show
    $scope.posts_yes_data=false;
    $scope.posts_no_data=false;
    
    //Wrapper around the album and post data, making it false
    $scope.albums_result_show=false;
    $scope.posts_result_show=false;
    
    //making progress bar visible now
    $scope.albums_progress_bar=true;
    $scope.posts_progress_bar=true;
    
    $scope.hiddenId1=obj.id;
    $scope.hiddenId3=obj;//for star persistence
    console.log($scope.hiddenId3);
    
    $.ajax({
        url: 'http://homework8-env.kamd3vgqsa.us-west-2.elasticbeanstalk.com/mysearch.php',
        data: {
                id: obj.id,
                type: current_type
              },
        type: 'GET',
        success: function(output) {
            //make progress bar hide again
            $scope.albums_progress_bar=false;
            $scope.posts_progress_bar=false;
            $timeout(function(){ create_albums_posts_table(output);}, 500);
       }
    });
}

//ALbums and Posts-2
function create_albums_posts_table(output) { 
    
    var jsonObject = JSON.parse(output);
    console.log(jsonObject);
    $scope.hiddenId2=jsonObject.name;
    $scope.album_values = [];
    $scope.post_values=[];
    
    //Making wrapper true now after progress bar
    $scope.albums_result_show=true;
    $scope.posts_result_show=true;
    
    //Albums
    if(typeof jsonObject.albums !== 'undefined') {
        if(jsonObject.albums!=null) {
            if(jsonObject.albums.data.length>0) {
                    $scope.albums_yes_data=true;
                    console.log('Albums JsonObject exist');
                    var albums_length = jsonObject.albums.data.length;
                    console.log(albums_length);
                    $scope.album_values=jsonObject.albums.data;
                    console.log("Album Values in next line :");
                    console.log($scope.album_values);
                } else {
                    console.log('Albums JsonObject length is less than 1');
                    $scope.albums_no_data=true;
                }
        } else {
            console.log('Albums JsonObject is null');
            $scope.albums_no_data=true;
        }
    } else {
        console.log('Albums JsonObject Undefined');
        $scope.albums_no_data=true;
    }
    
    
    //Posts
    if(typeof jsonObject.posts === 'undefined'){
        console.log('Posts JsonObject Undefined');
        $scope.posts_no_data=true;
        return;
    }
    if(jsonObject.posts==null){
        console.log('Posts JsonObject is null');
        $scope.posts_no_data=true;
        return;
    }
    if(jsonObject.posts.data.length<1){
        console.log('Posts JsonObject length is less than 1');
        $scope.posts_no_data=true;
        return;
    } else{
        $scope.posts_yes_data=true;
        console.log('Posts JsonObject exist');
        //var albums_length = jsonObject.albums.data.length;
        //console.log(albums_length);
        $scope.post_values=jsonObject.posts.data;
        $scope.post_values.forEach( function (arrayItem)
            {
                var m = moment(arrayItem.created_time);
                arrayItem.time = m.format("YYYY-MM-DD hh:mm:ss");
                
                if(arrayItem.message==null && arrayItem.story!=null){
                    arrayItem.message = arrayItem.story;
                }
        });
        console.log("Post Values in next line :");
        console.log($scope.post_values);
    }
    
    $scope.$apply();
}

//Facebook-1 Initialize
window.fbAsyncInit = function() {
    FB.init({
      appId      : '976242885851700',
      xfbml      : true,
      version    : 'v2.8'
    });
     FB.AppEvents.logPageView();
};

//$(document).ready(function() {
//    $('#fb-button').click(function() {
//        FB.ui({
//        method: 'share',
//        href: 'https://developers.facebook.com/docs/'
//        }, function(response){
//            if (response && !response.error_message) {
//              alert('Posted successfully.');
//            } else {
//              alert('Not Posted.');
//            }
//        });
//    });
//});
    
    
//Facebook-2 Only Sharing
$scope.fb_share=function(obj){
    fb(obj);
}

function fb(obj){
    FB.ui({
    method: 'share',
    href: 'https://developers.facebook.com/docs/',
    title: obj.name,  // The same than name in feed method
    picture: obj.picture.data.url,
    caption: 'FB SEARCH FROM USC CSCI571',
    display: 'popup'
    }, function(response){
        if (response && !response.error_message) {
          alert('Posted successfully.');
        } else {
          alert('Not Posted.');
        }
    });
}

//Facebook-3 Initialize
(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
    
});