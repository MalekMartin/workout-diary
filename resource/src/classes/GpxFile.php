<?php
class GpxFile {

    public function __construct($db) {
        $this->db = $db;
    }

    function insertGpxCoordinates($d) {
        $q = $this->db->prepare('INSERT INTO gpx_coordinates (name, lat, lon, ele) VALUES (?, ?, ?, ?)');
        $q->execute(array($d->name, $d->lat, $d->lon, $d->ele));
    }

    function getCoordinates() {
        return $this->_findCoordinates();
    }

    private function _findCoordinates() {
        $q = $this->db->prepare('SELECT id, name, lat, lon, ele FROM gpx_coordinates ORDER BY name ASC');
        $q->execute(array());
        return $q->fetchAll();
    }

}
