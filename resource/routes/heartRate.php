<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->post('/resource/heart/rest/add', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("test ");
    $mapper = new HeartRate($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $hr = $mapper->addRestingHr($d);
    return $response->withJson($hr);
});

$app->get('/resource/heart/rest/30-days', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("test ");
    $mapper = new HeartRate($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $hr = $mapper->get30DaysRestingHrs();
    return $response->withJson($hr);
});

$app->get('/resource/heart/rest/all', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("test ");
    $mapper = new HeartRate($this->db);
    $d = json_decode(file_get_contents('php://input'));
    // $hr = $mapper->getAllRestingHrs();
    $hr = $mapper->get30DaysRestingHrs();
    return $response->withJson($hr);
});

$app->get('/resource/heart/rest/weekly-avg', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("HR - weekly average");
    $mapper = new HeartRate($this->db);
    $hr = $mapper->getWeekAverages();
    return $response->withJson($hr);
});

$app->delete('/resource/heart/rest/{id}/delete', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("HR - delete");
    $mapper = new HeartRate($this->db);
    $hr = $mapper->deleteHRrecord($args['id']);
    return $response->withJson($hr);
});
