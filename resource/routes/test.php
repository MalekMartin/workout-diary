<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/test', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("test ");
    // $mapper = new Engine($this->db);
    // $engine = $mapper->getEngine($args['vehicleId']);
    // return $newResponse->withJson($engine);
});

// $app->get('/resource/engine/{vehicleId}', function (Request $request, Response $response, $args) {
//     $this->logger->addInfo("Vehicle engine info " . $args['vehicleId']);
//     $mapper = new Engine($this->db);
//     $engine = $mapper->getEngine($args['vehicleId']);
//     return $newResponse->withJson($engine);
// });


// $app->post('/resource/engine/{vehicleId}', function (Request $request, Response $response, $args) {
//     $this->logger->addInfo("Engine update" . $args['vehicleId']);
//     $mapper = new Engine($this->db);
//     $d = json_decode(file_get_contents('php://input'));
//     $engine = $mapper->updateEngine($d);
//     return $response->withJson($d);
// });