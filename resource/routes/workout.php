<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->post('/resource/workout/add', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("add workout");
    $mapper = new Workout($this->db);
    $d = json_decode(file_get_contents('php://input'));
    if (isset($d)) {
        $id = $mapper->addWorkout($d);
        return $response->withJson($id);
    } else {
        // bad request
        return $response->withStatus(400);
    }
});

$app->post('/resource/workout/{id}/update', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("update workout");
    $mapper = new Workout($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $id = $args['id'];
    if (isset($d) && !!$id) {
        $status = $mapper->updateWorkout($id, $d);
        if (!!$status) {
            return $response->withJson($id);
        } else {
            return $response->withStatus(500);
        }
    } else {
        // bad request
        return $response->withStatus(400);
    }
});

$app->delete('/resource/workout/{id}/delete', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("delete workout");
    $mapper = new Workout($this->db);
    if (isset($args['id'])) {
        $one = $mapper->deleteWorkout($args['id']);
        return $response->withJson($args['id']);
    } else {
        return $response->withStatus(404);
    }
});

$app->post('/resource/workout/{id}/file', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("File add");
    $mapper = new Workout($this->db);
    $file = $mapper->uploadLogFile($args['id']);

    if ($file === 400) {
        return $response->withStatus(400);
    } else {
        return $response->withJson($file);
    }
});

$app->post('/resource/workout/{id}/next-prev', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Find prev and next id of given workout");
    $mapper = new Workout($this->db);
    $filter = json_decode(file_get_contents('php://input'));

    if (isset($args['id'])) {
        $data = $mapper->findNextAndPrev($args['id'], $filter);
        return $response->withJson($data);
    } else {
        return $response->withStatus(400);
    }
});

$app->get('/resource/workout/all', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("all workouts");
    $mapper = new Workout($this->db);
    $d = json_decode(file_get_contents('php://input'));
    $all = $mapper->findAll();
    return $response->withJson($all);
});

$app->post('/resource/workouts/range', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("all workouts by date range");
    $mapper = new Workout($this->db);
    $from = isset($_GET['from']) ? $_GET['from'] : NULL;
    $to = isset($_GET['to']) ? $_GET['to'] : NULL;
    $types = json_decode(file_get_contents('php://input'));
    $all = $mapper->getAllByDateRange($from, $to, $types);
    return $response->withJson($all);
});

$app->get('/resource/workout/{id}', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("workout " . $args['id']);
    $mapper = new Workout($this->db);
    $one = $mapper->findOneById($args['id']);

    return !!$one
        ? $response->withJson($one)
        : $response->withStatus(404)
            ->withHeader('Content-Type', 'text/html')
            ->write('Workout was not found!');;
});

$app->get('/resource/workout/{id}/graph', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("workout graph data " . $args['id']);
    $mapper = new Workout($this->db);
    $data = $mapper->getGraphData($args['id'], $_GET['type']);
    // return $response->withJson($data);
    // $fh = fopen("graphfile.txt", "r");
    // $stream = new \Slim\Http\Stream($fh); // create a stream instance for the response body
    $json = json_encode($data);
    $length = strlen($json);

        return $response->withHeader('Content-Type', 'application/force-download')
                        ->withHeader('Content-Type', 'application/octet-stream')
                        // ->withHeader('Content-Type', 'application/download')
                        // ->withHeader('Content-Description', 'File Transfer')
                        // ->withHeader('Content-Transfer-Encoding', 'binary')
                        // ->withHeader('Content-Disposition', 'attachment; filename="' . basename($file) . '"')
                        ->withHeader('Content-Length', $length)
                        ->withHeader('Expires', '0')
                        ->withHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                        ->withHeader('Pragma', 'public')
                        // ->withBody($stream);
                        ->withJson($data);
});

$app->get('/resource/workout/{id}/logfile', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("workout log file " . $args['id']);
    $mapper = new Workout($this->db);
    $data = $mapper->getLogFile($args['id']);
    $body = $response->getBody();
    $body->write($data);
    return $response->withBody($body);
});

$app->delete('/resource/workout/file/{id}', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("delete workout file log " . $args['id']);
    $mapper = new Workout($this->db);
    $one = $mapper->deleteWorkoutFileLog($args['id']);
    return $response->withJson($args['id']);
});

$app->get('/resource/workout/{id}/check-point/{cp}/add', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Add check point to workout");
    $mapper = new Workout($this->db);
    $one = $mapper->addWorkoutCheckPoint($args['id'], $args['cp']);
    return $response->withJson($one);
});

$app->get('/resource/workout/{id}/route', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Get workout check points");
    $mapper = new Workout($this->db);
    $one = $mapper->getRouteCheckPoints($args['id']);
    return $response->withJson($one);
});

$app->get('/resource/workout/{id}/route/coordinates', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Get workout route");
    $mapper = new Workout($this->db);
    $one = $mapper->getTrackCoordinates($args['id']);
    return $response->withJson($one);
});

$app->get('/resource/workout/{id}/analyze-hr', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Get analyzed workout hr");
    $mapper = new Workout($this->db);
    if (isset($_REQUEST['max']) && isset($args['id'])) {
        $one = $mapper->analyzeWorkoutHr($args['id'], $_REQUEST['max']);
        return $response->withJson($one);
    } else {
        return $response->withStatus(400)
            ->write('Nebylo zadáno SFmax nebo workoutId');
    }
    
});

$app->delete('/resource/workout/{id}/check-point/{cp}/delete', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Delete check point from workout");
    $mapper = new Workout($this->db);
    $one = $mapper->deleteWorkoutCheckPoint($args['id'], $args['cp']);
    return $response->withJson($one);
});

$app->post('/resource/csv-to-gpx', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Upload CSV to be parsed to GPX");
    $mapper = new Workout($this->db);
    $file = $mapper->createCsvTempFile();
    return $response->withJson($file);
});

$app->get('/resource/csv-to-gpx/gpx', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Get GPX file");
    $mapper = new Workout($this->db);
    if (isset($_GET['id'])) {
        $data = $mapper->csv2gpx($_GET['id']);

        $fh = fopen("parsed.gpx", 'rb');
        $stream = new \Slim\Http\Stream($fh); // create a stream instance for the response body

        return $response->withHeader('Content-Type', 'application/force-download')
                        ->withHeader('Content-Type', 'application/octet-stream')
                        ->withHeader('Content-Type', 'application/download')
                        ->withHeader('Content-Description', 'File Transfer')
                        ->withHeader('Content-Transfer-Encoding', 'binary')
                        ->withHeader('Content-Disposition', 'attachment; filename="parsed.gpx"')
                        ->withHeader('Expires', '0')
                        ->withHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                        ->withHeader('Pragma', 'public')
                        ->withBody($stream);
    } else {
        return $response->withStatus(400)
            ->write('No file id was received!');
    }
});
