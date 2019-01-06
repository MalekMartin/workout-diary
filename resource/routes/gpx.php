<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->post('/resource/gpx/coordinates/add', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Add gpx coordinates");
    $mapper = new GpxFile($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $data = $mapper->insertGpxCoordinates($d);
    // return !!$data 
    //     ? $response->withJson($data)
    //     : $response->withStatus(400)->write('Zaznam nebyl vlozen');
    return $response->withJson($data);
});

$app->get('/resource/gpx/coordinates/all', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Get all gears");
    $mapper = new GpxFile($this->db);
    // $data = $mapper->findAllGear();
    $data = $mapper->getCoordinates();
    return $response->withJson($data);
});