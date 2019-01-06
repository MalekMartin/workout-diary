<?php
class WahooWorkoutRowDto {
    public $timestampUnix;
    public $timestamp;
    public $active;
    public $latitude;
    public $longitude;
    public $heartrate;
    public $speed;
    public $distance;
    public $crankCadence;
    public $runCadence;
    public $elevation;
    public $power;

    public function __construct($r) {
        // echo $r[11];
        // try {
            $this->timeStampUnix = isset($r[0]) ? $r[0] : null;
            $this->timestamp = isset($r[1]) ? $r[1] : null;
            $this->active = isset($r[2]) && $r[2] == 'true' ? true : false;
            $this->latitude = isset($r[3]) ? floatval($r[3]) : 0;
            $this->longitude = isset($r[3]) ? floatval($r[4]) : 0;
            $this->heartrate = isset($r[3]) ? floatval($r[5]) : 0;
            $this->speed = isset($r[3]) ? floatval($r[6]) : 0;
            $this->distance = isset($r[3]) ? floatval($r[7]) : 0;
            $this->crankCadence = isset($r[3]) ? floatval($r[8]) : 0;
            $this->runCadence = isset($r[3]) ? floatval($r[9]) : 0;
            $this->elevation = isset($r[3]) ? floatval($r[10]) : 0;
            $this->power = isset($r[3]) ? floatval($r[11]) : 0;
        // } catch (Exception  $e) {
        //     echo 'Caught exception: ',  $e->getMessage(), "\n";
        //     throw('Inserted row has incorrect format! Check row columns.');
        // }
    }
}