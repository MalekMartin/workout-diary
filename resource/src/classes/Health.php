<?php
class Health {

    public function __construct($db) {
        $this->db = $db;
    }

    function insertIllness($d) {
        $q = $this->db->prepare('INSERT INTO illness (date, time, type, note, course) VALUES (?, ?, ?, ?, ?)');
        $q->execute(array($d->date, $d->time, $d->type, $d->note, $d->course));
    }

    function updateIllness($id, $d) {
        $q = $this->db->prepare('UPDATE illness SET date = ? , time = ?, type = ?, note = ?, course = ? WHERE id = ?');
        $q->execute(array($d->date, $d->time, $d->type, $d->note, $d->course, $id));
    }

    function getIllnessByDate($from, $to) {
        return $this->_findIllnessByDate($from, $to);
    }

    function deleteIllness($id) {
        $q = $this->db->prepare('DELETE FROM illness WHERE id = ?');
        $q->execute(array($id));
    }

    private function _findIllnessByDate($from, $to) {
        $q = $this->db->prepare('SELECT id, date, time, type, note, course FROM illness 
            WHERE date >= ? AND date <= ?
            ORDER BY date ASC, time ASC');
        $q->execute(array(date('Y-m-d\TH:i:s.000\Z', strtotime($from)), date('Y-m-d\TH:i:s.000\Z', strtotime($to))));
        return $q->fetchAll();
    }
}