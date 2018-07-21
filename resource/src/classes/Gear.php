<?php
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
        return $this->execute(array($d->brand, $d->model, $d->purchaseDate, $d->price, $d->id));
    }

    public function findAllGear() {
        $q = $this->db->prepare('SELECT id, brand, model, purchaseDate, manufactureYear, price FROM gear ORDER BY brand ASC, model ASC');
        $q->execute(array());
        return $q->fetchAll();
    }
}