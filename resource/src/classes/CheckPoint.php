<?php
require 'dto/CheckPointDto.php';

class CheckPoint {

    public function __construct($db)
    {
        $this->db = $db;
    }

    function addCheckPoint($d) {
        $query = $this->db->prepare('INSERT INTO check_points (`name`, lat, lon) VALUES (?,?,?)');
        $query->execute(array($d->name, $d->lat, $d->lon));
        return $this->db->lastInsertId();
    }

    function getAllCheckPoints() {
        return $this->_findAllCheckPoints();
    }

    function deleteCheckPoint($id) {
        $q = $this->db->prepare('DELETE FROM check_points WHERE id = ?');
        return $q->execute(array($id));
    }

    private function _findAllCheckPoints() {
        $query = $this->db->prepare('SELECT id, `name`, lat, lon FROM check_points ORDER BY `name` ASC');
        $query->execute(array());
        $res = $query->fetchAll();
        $data = [];
        foreach($res as $v) {
            $data[] = new CheckPointDto($v);
        }
        return $data;
    }
}