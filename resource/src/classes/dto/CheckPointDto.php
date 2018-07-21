<?php
class CheckPointDto
{
    public $id;
    public $name;
    public $lat;
    public $lon;

    public function __construct($v) {
        $this->id = $v['id'];
        $this->name = $v['name'];
        $this->lat = floatval($v['lat']);
        $this->lon = floatval($v['lon']);
    }

    public function getId() { return $this->id; }
    public function getname() { return $this->name; }
    public function getlat() { return $this->lat; }
    public function getlon() { return $this->lon; }
}