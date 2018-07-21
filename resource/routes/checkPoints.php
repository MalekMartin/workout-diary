<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->post('/resource/check-points/add', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Add new checkpoint");
    $mapper = new CheckPoint($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $cp = $mapper->addCheckPoint($d);
    return $response->withJson($cp);
});

$app->get('/resource/check-points/all', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Checkpoint list");
    $mapper = new CheckPoint($this->db);
    $cp = $mapper->getAllCheckPoints();
    return $response->withJson($cp);
});

$app->delete('/resource/check-points/{id}/delete', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Delete checkpoint");
    $mapper = new CheckPoint($this->db);
    $cp = $mapper->deleteCheckPoint($args['id']);
    return $response->withJson($cp);
});