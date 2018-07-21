<?php
class WorkoutFileDto {
    public $id;
    public $name;
    public $type;
    public $size;

    public function __construct($id, $name, $type, $size) {
        $this->id = $id;
        $this->name = $name;
        $this->type = $type;
        $this->size = intval($size);
    }
}