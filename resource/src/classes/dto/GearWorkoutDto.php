<?php
class GearWorkoutDto
{
    public $id;
    public $brand;
    public $model;
    public $purchaseDate;
    public $manufactureYear;
    public $price;
    public $distance;
    public $duration;
    public $count;

    public function __construct($v) {
        $this->id = $v['gear'];
        $this->brand = $v['brand'];
        $this->model = $v['model'];
        $this->purchaseDate = $v['purchaseDate'];
        $this->manufactureYear = $v['manufactureYear'];
        $this->price = floatval($v['price']);
        $this->distance = round(floatval($v['distance']));
        $this->duration = floatval($v['duration']);
        $this->count = intval($v['count']);
    }
}