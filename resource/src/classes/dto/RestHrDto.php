<?php
class RestHrDto
{
    public $id;
    public $date;
    public $bpm;
    public $note;
    public $activity;

    public function __construct($v) {
        $this->id = $v['id'];
        $this->date = $v['date'];
        $this->bpm = intval($v['bpm']);
        $this->note = $v['note'];
        $this->activity = $v['activity'];
    }

    public function getId() { return $this->id; }
    public function getDate() { return $this->date; }
    public function getBpm() { return $this->bpm; }
    public function getNote() { return $this->note; }
}
