<?php
class WeeklyRestHrDto
{
    public $week;
    public $bpm;

    public function __construct($week, $bpm) {
        $this->week = $week;
        $this->bpm = intval($bpm);
    }

    public function getweek() { return $this->week; }
    public function getBpm() { return $this->bpm; }
}
