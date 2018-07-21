<?php

require 'WorkoutFileDto.php';
require 'WorkoutGearDto.php';

class WorkoutDto
{
    public $id;
    public $date;
    public $time;
    public $name;
    public $activity;
    public $duration;
    public $distance;
    public $avgHr;
    public $avgSpeed;
    public $avgCadence;
    public $maxHr;
    public $maxSpeed;
    public $maxCadence;
    public $maxEle;
    public $minEle;
    public $eleUp;
    public $eleDown;
    public $energy;
    public $note;
    public $log;
    public $gear;

    public function __construct($v) {
        $this->id = $v['id'];
        $this->date = $v['date'];
        $this->time = $v['time'];
        $this->name = $v['name'];
        $this->activity = intval($v['activity']);
        $this->duration = intval($v['duration']);
        $this->distance = floatval($v['distance']);
        $this->avgHr = intval($v['avgHr']);
        $this->avgSpeed = floatval($v['avgSpeed']);
        $this->avgCadence = intval($v['avgCadence']);
        $this->maxHr = intval($v['maxHr']);
        $this->maxSpeed = floatval($v['maxSpeed']);
        $this->maxCadence = intval($v['maxCadence']);
        $this->maxEle = intval($v['maxEle']);
        $this->minEle = intval($v['minEle']);
        $this->eleUp = intval($v['eleUp']);
        $this->eleDown = intval($v['eleDown']);
        $this->energy = intval($v['energy']);
        $this->note = $v['note'];
        $this->log = new WorkoutFileDto($v['log'], $v['filename'], $v['type'], $v['size']);
        $this->gear = new WorkoutGearDto($v['gearId'], $v['brand'], $v['model']);
    }
}
