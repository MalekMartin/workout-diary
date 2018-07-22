<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->post('/resource/gear/add', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Add gear");
    $mapper = new Gear($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $data = $mapper->addGear($d);
    return !!$data 
        ? $response->withJson($data)
        : $response->withStatus(400)->write('Zaznam nebyl vlozen');
});

$app->post('/resource/gear/{id}/update', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Update gear");
    $mapper = new Gear($this->db);
    $d = json_decode(file_get_contents('php://input'));
    if (isset($args['id'])) {
        $data = $mapper->updateGear($args['id'], $d);
        return $response->withJson($data);
    } else {
        return $response->withStatus(400)->write('Nebylo zadano id!');
    }
});

$app->get('/resource/gear/all', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Get all gears");
    $mapper = new Gear($this->db);
    // $data = $mapper->findAllGear();
    $data = $mapper->findAllWithWorkoutProperties();
    return $response->withJson($data);
});

$app->delete('/resource/gear/{id}/delete', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Delete gear");
    $mapper = new Gear($this->db);
    if (isset($args['id'])) {
        $data = $mapper->deleteGear($args['id']);
        return $response->withJson($data);
    } else {
        return $response->withStatus(400)->write('Nebylo zadano id!');
    }
});