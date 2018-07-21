<?php
class HrWorkoutDto
{
    public $date;
    public $duration;

    public function __construct($v) {
        $this->date = $v['date'];
        $this->duration = round(floatval($v['duration']) / 60, 1);
    }

    public function getDate() { return $this->date; }
    public function getDuration() { return $this->duration; }
}
