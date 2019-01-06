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

    public function editRestingHr($d) {
        $query = $this->db->prepare('UPDATE rest_hr SET `date` = ?, bpm = ?, note = ? , activity = ? WHERE id = ?');
        return $query->execute(array($d->date, $d->bpm, $d->note, $d->activity ? $d->activity->id : null, $d->id));
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

        return array('hr' => $data, 'workouts' => $this->_prepare30DaysWorkouts());
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
        $date = date('Y-m-j');
        $to = date ( 'Y-m-d\TH:i:sP' , strtotime($date) );

        $newdate = strtotime('-365 day' , strtotime($date)) ;
        $from = date('Y-m-d\TH:i:sP', $newdate);

        $raw = $this->_findHrInDateRange($from, $to, 'DESC');

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

    private function _findHrInDateRange($from, $to, $sort = 'DESC') {
        $query = $this->db->prepare('SELECT id, date, bpm, note, activity FROM rest_hr
            WHERE date >= ? AND date <= ? ORDER BY date '.$sort);
        $query->execute(array($from, $to));
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

    private function _find30DaysWorkouts() {
        $date = date('Y-m-j');
        $newdate = strtotime('-30 day' , strtotime($date)) ;
        $from = date('Y-m-d\TH:i:sP', $newdate);

        $query = $this->db->prepare('SELECT activity, a.name, `date`, duration
           FROM workout
           JOIN activity a ON activity = a.id
           WHERE `date` >= ? 
           ORDER BY date DESC');
        $query->execute(array($from));
        return $query->fetchAll();
    }

    private function _prepare30DaysWorkouts() {
        $d = $this->_find30DaysWorkouts();
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
            'run' => count($run) > 0 ? $run : null,
            'cicle' => count($cicle) > 0 ? $cicle : null,
            'spin' => count($spin) > 0 ? $spin : null,
            'moto' => count($moto) > 0 ? $moto : null,
            'walk' => count($walk) > 0 ? $walk : null,
            'gym' => count($gym) > 0 ? $gym : null,
            'football' => count($football) > 0 ? $football : null,
            'rollerskates' => count($rollers) > 0 ? $rollers : null,
            'other' => count($other) > 0 ? $other : null
        );
    }
}
