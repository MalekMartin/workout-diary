<?php
require 'dto/RestHrDto.php';
require 'dto/HrWorkoutDto.php';
require 'dto/WeeklyRestHrDto.php';
class HeartRate {

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function addRestingHr($d) {
        $query = $this->db->prepare('INSERT INTO rest_hr (`date`, bpm, note, activity) VALUES (?,?,?,?)');
        $query->execute(array($d->date, $d->bpm, $d->note, $d->activity));
        return new RestHrDto($this->_getLastRestHr());
    }

    public function get30DaysRestingHrs() {
        $date = date('Y-m-j');
        $newdate = strtotime ( '-30 day' , strtotime ( $date ) ) ;
        $newdate = date ( 'Y-m-d\TH:i:sP' , $newdate );

        $query = $this->db->prepare('SELECT id, `date`, bpm, note, activity FROM rest_hr
        WHERE `date` >= ?
        ORDER BY `date` ASC LIMIT 60');
        $query->execute(array($newdate));

        $raw = $query->fetchAll();
        $data = [];
        foreach ($raw as $r) {
            $data[] = new RestHrDto($r);
        }
        // return $data;

        return array('hr' => $data, 'workouts' => $this->_prepareWorkouts());
    }

    public function getAllRestingHrs() {
        $raw = $this->_findAllRecords();
        $data = [];
        foreach ($raw as $r) {
            $data[] = new RestHrDto($r);
        }
        return array('hr' => $data, 'workouts' => []);
    }
    
    public function getWeekAverages() {
        $raw = $this->_findAllRecords('DESC');

        $hrSum = 0;
        $count = 0;
        $data = [];
        foreach($raw as $r) {
            $count += 1;
            $hrSum += intval($r['bpm']);
            $date = new DateTime($r['date']);
            $week = $date->format("W");
            if ($count == 7) {
                $avgHr = ceil($hrSum / 7);
                $data[] = new WeeklyRestHrDto($week, $avgHr);
                $count = 0;
                $hrSum = 0;
            }
        }
        if ($count != 0) {
            $avgHr = ceil($hrSum / ($count));
            $data[] = new WeeklyRestHrDto($week, $avgHr);
        }

        return array_reverse($data);
    }

    function deleteHRrecord($id) {
        $query = $this->db->prepare('DELETE FROM rest_hr WHERE id = ?');
        $query->execute(array($id));
    }

    private function _findAllRecords($sort = 'ASC') {
        $query = $this->db->prepare('SELECT id, `date`, bpm, note, activity FROM rest_hr
        ORDER BY `date` ' . $sort);
        $query->execute(array());

        return $query->fetchAll();
    }

    private function _getLastRestHr() {
        return $this->_findRestingHrById($this->db->lastInsertId());
    }

    private function _findRestingHrById($id) {
        $query = $this->db->prepare('SELECT id, `date`, bpm, note, activity FROM rest_hr WHERE id = ?');
        $query->execute(array($id)); 
        return $query->fetch();
    } 

    private function _findLastWorkouts() {
        $query = $this->db->prepare('SELECT activity, `date`, duration
            FROM workout ORDER BY date DESC LIMIT 60');
        $query->execute();
        return $query->fetchAll();
    }

    private function _prepareWorkouts() {
        $d = $this->_findLastWorkouts();
        $walk = [];
        $run = [];
        $spin = [];
        $cicle = [];
        $moto = [];
        $gym = [];
        $football = [];
        $rollers = [];
        $other = [];
        for ($i = 0; $i < count($d); $i++) {
            if ($d[$i]['activity'] == 1) {
                $run[] = new HrWorkoutDto($d[$i]);
            } else if ($d[$i]['activity'] == 2) {
                $cicle[] = new HrWorkoutDto($d[$i]);
            } else if ($d[$i]['activity'] == 3) {
                $spin[] = new HrWorkoutDto($d[$i]);
            } else if ($d[$i]['activity'] == 4) {
                $moto[] = new HrWorkoutDto($d[$i]);
            } else if ($d[$i]['activity'] == 5) {
                $walk[] = new HrWorkoutDto($d[$i]);
            } else if ($d[$i]['activity'] == 6) {
                $gym[] = new HrWorkoutDto($d[$i]);
            } else if ($d[$i]['activity'] == 7) {
                $football[] = new HrWorkoutDto($d[$i]);
            } else if ($d[$i]['activity'] == 8) {
                $rollers[] = new HrWorkoutDto($d[$i]);
            } else {
                $other[] = new HrWorkoutDto($d[$i]);
            }
        }
        return array(
            'run' => $run,
            'cicle' => $cicle,
            'spin' => $spin,
            'moto' => $moto,
            'walk' => $walk,
            'gym' => $gym,
            'football' => $football,
            'rollerskates' => $rollers,
            'other' => $other
        );
    }
}
