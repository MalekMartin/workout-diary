<?php
class ActivityDto {
    public $id;
    public $name;
    public $color;
    public $icon;

    public function __construct($id, $name, $color, $icon) {
        $this->$id = $id;
        $this->name = $name;
        $this->color = $color;
        $this->icon = $icon;
    }
}