<?php
require 'dto/ActivityDto.php';

class Activity {

    public function __construct($db) {
        $this->db = $db;
    }

    public function addActivity($d) {
        $hr = $d->hr ? 1 : 0;
        $speed = $d->speed ? 1 : 0;
        $cad = $d->cadence ? 1 : 0;
        $ele = $d->elevation ? 1 : 0;
        $q = $this->db->prepare('INSERT INTO activity (`name`, color, icon, hr, speed, cadence, elevation) VALUE (?,?,?,?,?,?,?)');
        return $q->execute(array($d->name, $d->color, $d->icon, $hr, $speed, $cad, $ele));
    }

    public function deleteActivity($id) {
        $q = $this->db->prepare('DELETE FROM activity WHERE id = ?');
        return $q->execute(array($id));
    }

    public function updateActivity($id, $d) {
        $hr = $d->hr ? 1 : 0;
        $speed = $d->speed ? 1 : 0;
        $cad = $d->cadence ? 1 : 0;
        $ele = $d->elevation ? 1 : 0;
        $q = $this->db->prepare('UPDATE activity SET `name` = ?, color = ?, icon = ?, hr = ?, speed = ?, cadence = ?, elevation = ? WHERE id = ?');
        return $q->execute(array($d->name, $d->color, $d->icon, $hr, $speed, $cad, $ele, $id));
    }

    public function getActivities() {
        $q = $this->db->prepare('SELECT id, `name`, color, icon, hr, speed, cadence, elevation FROM activity ORDER BY id ASC');
        $q->execute(array());
        $res = $q->fetchAll();

        $data = [];
        foreach ($res as $v) {
            $data[] = new ActivityDto($v);
        }
        return $data;
    }
}