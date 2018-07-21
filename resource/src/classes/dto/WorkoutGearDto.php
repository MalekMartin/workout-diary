<?php
class WorkoutGearDto {

    public $id;
    public $brand;
    public $model;

    public function __construct($id, $brand, $model) {
        $this->id = $id;
        $this->brand = $brand;
        $this->model = $model;
    }
}
