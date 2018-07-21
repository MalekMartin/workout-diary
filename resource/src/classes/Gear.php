<?php
require 'dto/GearWorkoutDto.php';

class Gear {

    public function __construct($db) {
        $this->db = $db;
    }

    public function addGear($d) {
        $q = $this->db->prepare('INSERT INTO gear (brand, model, purchaseDate, manufactureYear, price) VALUE (?,?,?,?,?)');
        return $q->execute(array($d->brand, $d->model, $d->purchaseDate, $d->manufactureYear, $d->price));
    }

    public function deleteGear($id) {
        $q = $this->db->prepare('DELETE FROM gear WHERE id = ?');
        return $q->execute(array($id));
    }

    public function updateGear($d) {
        $q = $this->db->prepare('UPDATE gear SET brand = ?, model = ?, purchaseDate = ?, manufactureYear = ?, price = ? WHERE id = ?');
        return $q->execute(array($d->brand, $d->model, $d->purchaseDate, $d->price, $d->id));
    }

    public function findAllGear() {
        $q = $this->db->prepare('SELECT id, brand, model, purchaseDate, manufactureYear, price FROM gear ORDER BY brand ASC, model ASC');
        $q->execute(array());
        return $q->fetchAll();
    }

    public function findAllWithWorkoutProperties() {
        $all = $this->_findAllWithWorkoutProperties();
        $data = [];
        foreach($all as $v) {
            $data[] = new GearWorkoutDto($v);
        }
        return $data;
    }

    private function _findAllWithWorkoutProperties() {
        $q = $this->db->prepare('SELECT g.id as gear, g.brand, g.model, g.purchaseDate, g.manufactureYear, g.price,
        (SELECT SUM(w.distance) FROM workout as w WHERE w.gearId = gear) as distance,
        (SELECT SUM(w.duration) FROM workout as w WHERE w.gearId = gear) as duration,
        (SELECT count(w.id) FROM workout as w WHERE w.gearId = gear) as count
        FROM gear as g 
        ORDER BY brand ASC, model ASC');
        $q->execute(array());
        return $q->fetchAll();
    }
}