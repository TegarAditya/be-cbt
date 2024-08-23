<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

$host = "127.0.0.1";
$user = "root";
$pass = "root";
$nama_db = "be_cbt"; //nama database
$con = mysqli_connect($host, $user, $pass, $nama_db);

$queryResult = $con->query("SELECT * FROM soal WHERE id_mapel=637;");


$result = array();
$salah = array();
while ($fetchData = $queryResult->fetch_assoc()) {

    $result[] = $fetchData;
}
$jsonResult = array(
    "response_code" => 0,
    "results" => $result
);

echo json_encode($jsonResult);
