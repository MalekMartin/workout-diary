<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/resource/csv/to-gpx', function (Request $request, Response $response, $args) {
    $this->logger->addInfo("Convert csv to gpx");
    $mapper = new CsvFile($this->db);

    if (isset($_GET['id'])) {
        $data = $mapper->convertToGpx($_GET['id']);

        if ($data === 'NO_FILE') {
            return $response->withStatus(404)
                ->write('File not found!');
        } else if ($data === 'NO_CONTENT') {
            return $response->withStatus(404)
                ->write('No content found!');
        } else if ($data === 'NO_ROWS') {
            return $response->withStatus(404)
                ->write('No rows detected!');
        }

        $fh = fopen("parsed.gpx", 'rb');
        $stream = new \Slim\Http\Stream($fh); // create a stream instance for the response body
        $fileContent = file_get_contents('parsed.gpx');

        return $response->withHeader('Content-Type', 'application/force-download')
                        ->withHeader('Content-Type', 'application/octet-stream')
                        ->withHeader('Content-Type', 'application/download')
                        ->withHeader('Content-Description', 'File Transfer')
                        ->withHeader('Content-Transfer-Encoding', 'binary')
                        ->withHeader('Content-Disposition', 'attachment; filename="' . basename($file) . '"')
                        ->withHeader('Expires', '0')
                        ->withHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                        ->withHeader('Pragma', 'public')
                        ->withBody($stream);
    } else {
        return $response->withStatus(400)
            ->write('No file id was received!');
    }
});

// One time operation to export all files from DB
// $app->get('/resource/csv/save-all', function (Request $request, Response $response, $args) {
//     $this->logger->addInfo("Save all files");
//     $mapper = new CsvFile($this->db);
//     $id = $mapper->saveAllFiles();
//     return $response->withStatus(200);
// });