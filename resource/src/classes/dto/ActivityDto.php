<?php
class ActivityDto {
    public $id;
    public $name;
    public $color;
    public $icon;
    public $hr;
    public $speed;
    public $cadence;
    public $elevation;

    public function __construct($v) {
        $this->id = $v['id'];
        $this->name = $v['name'];
        $this->color = $v['color'];
        $this->hr = $v['hr'];
        $this->speed = $v['speed'];
        $this->cadence = $v['cadence'];
        $this->elevation = $v['elevation'];
    }
}