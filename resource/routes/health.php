<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->post('/resource/health/illness/add', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Add illness");
    $mapper = new Health($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $data = $mapper->insertIllness($d);
    // return !!$data 
    //     ? $response->withJson($data)
    //     : $response->withStatus(400)->write('Zaznam nebyl vlozen');
    return $response->withJson($data);
});

$app->post('/resource/health/illness/{id}/edit', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Edit illness");
    $mapper = new Health($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $data = $mapper->updateIllness($args['id'], $d);
    // return !!$data 
    //     ? $response->withJson($data)
    //     : $response->withStatus(400)->write('Zaznam nebyl vlozen');
    return $response->withJson($data);
});

$app->post('/resource/health/illness/by-date-range', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Get illness by date range");
    $mapper = new Health($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $data = $mapper->getIllnessByDate($d->from, $d->to);
    return $response->withJson($data);
});

$app->delete('/resource/health/illness/{id}/delete', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Get illness by date range");
    $mapper = new Health($this->db);
    $data = $mapper->deleteIllness($args['id']);
    return $response->withJson($data);
});