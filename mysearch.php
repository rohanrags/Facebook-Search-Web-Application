<?php
date_default_timezone_set('America/Los_Angeles');
ini_set('display_errors', 'Off');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-type");
header("Access-Control-Allow-Methods: ['OPTIONS','GET','POST']");

$access_token = "&access_token=EAAN340JsZBjQBALk8fkgg8oa03kJfv6CA9DQ9neExHYoShKZBAj9mSYYEuU1Sm0O0WlQ4hY2NrAXZAZA6G1ZCZAIebsM3ujy9Y45zRJJJF1w7ZC9MC0V8mDpE1WcMNMPG5ZBHLcxPcrKMUeZCmUKKIGtFK7ZAy0o53troAlDR0ptRQkQZDZD";

//For MainTable Results
$keyword = $_GET['keyword'];
$type = $_GET['type'];
$lat = $_GET['lat'];
$lng = $_GET['lng'];
$dist = $_GET['dist'];

//For Albums and Posts
$id = $_GET['id'];

$paging_url = $_GET['paging_url'];

if(isset($type) && !empty($type)) {
    if(isset($keyword) && !empty($keyword)) {
        if($type=='user'||$type=='page'||$type=='group'||$type=='event') {
            $url = "https://graph.facebook.com/v2.8/search?q=".urlencode($keyword)."&type=".urlencode($type)."&fields=picture.width(700).height(700),name".$access_token;
            $result = file_get_contents($url);
            echo $result;
        } else if($type=='place'){
            $url = "https://graph.facebook.com/v2.8/search?q=".urlencode($keyword)."&type=".urlencode($type)."&center=".$lat.",".$lng."&fields=picture.width(700).height(700),name".$access_token;
            $result = file_get_contents($url);
            echo $result;
        }
    }
}

if(isset($paging_url) && !empty($paging_url)){
    $result = file_get_contents($paging_url);
    echo $result;
}

if(isset($id) && !empty($id)){
    if(isset($type) && !empty($type)){
        if($type=='event') {
             $url = "https://graph.facebook.com/v2.8/".$id."?fields=id,name,picture.width(700).height(700),posts.limit(5)".$access_token;
            $result = file_get_contents($url);
            echo $result;
        } else if($type=='user'||$type=='page'||$type=='group'||$type=='place'){
            $url = "https://graph.facebook.com/v2.8/".$id."?fields=id,name,albums.limit(5){name,photos.limit(2){name,picture}},posts.limit(5)".$access_token;
            $result = file_get_contents($url);
            echo $result;
        }
    }
}



?>
