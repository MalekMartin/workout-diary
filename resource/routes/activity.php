<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->post('/resource/activity/add', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("add activity");
    $mapper = new Activity($this->db);
    $d = json_decode(file_get_contents('php://input'));
    if (isset($d)) {
        $id = $mapper->addActivity($d);
        return $response->withJson($id);
    } else {
        // bad request
        return $response->withStatus(400);
    }
});

$app->post('/resource/activity/{id}/update', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("update activity");
    $mapper = new Activity($this->db);
    $d = json_decode(file_get_contents('php://input'));
    if (isset($d) && isset($args['id'])) {
        $id = $mapper->updateActivity($args['id'], $d);
        return $response->withJson($id);
    } else {
        // bad request
        return $response->withStatus(400);
    }
});

$app->get('/resource/activity/all', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("get all activities");
    $mapper = new Activity($this->db);
    $id = $mapper->getActivities();
    return $response->withJson($id);
});

$app->delete('/resource/activity/{id}/delete', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("delete activity");
    $mapper = new Activity($this->db);
    if (isset($args['id'])) {
        $id = $mapper->deleteActivity($args['id']);
        return $response->withJson($args['id']);
    } else {
        // bad request
        return $response->withStatus(400);
    }
});
