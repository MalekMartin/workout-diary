<?php
class HrWorkoutDto
{
    public $activity;
    public $date;
    public $duration;

    public function __construct($v) {
        $this->date = $v['date'];
        $this->duration = round(floatval($v['duration']) / 60, 1);
        $this->activity = $v['activity'];
    }

    public function getDate() { return $this->date; }
    public function getDuration() { return $this->duration; }
}
