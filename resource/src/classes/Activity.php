<?php
class Activity {

    public function __construct($db) {
        $this->db = $db;
    }

    public function addActivity($d) {
        $q = $this->db->prepare('INSERT INTO activity (`name`, color, icon) VALUE (?,?,?)');
        return $q->execute(array($d->name, $d->color, $d->icon));
    }

    public function deleteActivity($id) {
        $q = $this->db->prepare('DELETE FROM activity WHERE id = ?');
        return $q->execute(array($id));
    }

    public function updateActivity($id, $d) {
        $q = $this->db->prepare('UPDATE activity SET `name` = ?, color = ?, icon = ? WHERE id = ?');
        return $q->execute(array($d->name, $d->color, $d->icon, $id));
    }

    public function getActivities() {
        $q = $this->db->prepare('SELECT id, `name`, color, icon FROM activity ORDER BY id ASC');
        $q->execute(array());
        return $q->fetchAll();
    }
}