<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';

spl_autoload_register(function ($classname) {
    require ("../classes/" . $classname . ".php");
});

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$config['db']['host']   = "localhost";
$config['db']['user']   = "root";
$config['db']['pass']   = "vertrigo";
$config['db']['dbname'] = "workout_diary";

$app = new \Slim\App(["settings" => $config]);

$container = $app->getContainer();

$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler("../logs/app.log");
    $logger->pushHandler($file_handler);
    return $logger;
};

$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO("mysql:host=" . $db['host'] . ";dbname=" . $db['dbname'],
        $db['user'], $db['pass'], [PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

//$app->get('/hello/{name}', function (Request $request, Response $response) {
//    $name = $request->getAttribute('name');
//    $response->getBody()->write("Hello, $name");
//
//    return $response;
//});

/**
* List of app routes
*/
require "../../routes/heartRate.php";
require "../../routes/workout.php";
require "../../routes/checkPoints.php";
require "../../routes/csvFile.php";
require "../../routes/gear.php";
require "../../routes/activity.php";
// $app->get('/resource/heart/rest/add', function (Request $request, Response $response, $args) {
//     $this->logger->addInfo("test ");
//     $mapper = new HeartRate($this->db);
//     $hr = $mapper->addRestingHr($args['vehicleId']);
//     return $newResponse->withJson($hr);
// });


$app->run();