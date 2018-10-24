<?php
require 'dto/WorkoutDto.php';
require 'dto/WahooWorkoutRowDto.php';

class Workout {

    public $columns = array(
        'TIMESTAMP' => 0,   // 0 - Timestamp (UNIX time ms)
        'TIME' => 1,    // 1 - Timestamp
        'ACTIVE' => 2,  // 2 - Active (T/F)
        'LAT' => 3,     // 3 - Latitude (deg)
        'LON' => 4,     // 4 - Longitude (deg)
        'HR' => 5,      // 5 - Heartrate (bpm)
        'SPEED' => 6,   // 6 - Speed (mps)
        'DST' => 7,     // 7 - Distance (m)
        'CCAD' => 8,    // 8 - Crank Cadence (rpm)
        'CAD' => 9,     // 9 - Run Cadence (steps/min)
        'ELE' => 10,    // 10 - Elevation (m)
        'POWER' => 11   // 11 Power (watts)
    );

    public $multiplier = array(
        'HR' => 1,
        'SPEED' => 3.6,
        'CAD' => 1,
        'ELE' => 1
    );

    public $routeComparer;

    public function __construct($db, $logger)
    {
        $this->db = $db;
        $this->logger = $logger;
        $this->routeComparer = new RouteComparer($db, $logger);
    }

    public function addWorkout($d) {
        $duration = $d->sec + ($d->min * 60) + ($d->hour * 60 * 60);
        $gear = !!$d->gear ? $d->gear : null;
        $query = $this->db->prepare('INSERT INTO workout (name, activity, `date`, `time`, duration, energy, distance, note, gearId)
            VALUES (?,?,?,?,?,?,?,?,?)');
        $query->execute(array($d->name, $d->activity, $d->date, $d->time, $duration, $d->energy, $d->distance, $d->note, $gear));

        return $this->db->lastInsertId();
    }

    public function updateWorkout($id, $d) {
        $duration = $d->sec + ($d->min * 60) + ($d->hour * 60 * 60);
        $q = $this->db->prepare('UPDATE workout SET name = ?, activity = ?, `date` = ?, `time` = ?, duration = ?, energy = ?, distance = ? , note = ?, gearId = ? WHERE id = ?');
        $q->execute(array($d->name, $d->activity, $d->date, $d->time, $duration, $d->energy, $d->distance, $d->note, $d->gear, $id));
        return $q;
    }

    public function findAll($types = null) {
        $inArray = !!$types && count($types)
            ? ' AND workout.activity IN (' . implode(",", $types) . ') '
            : '';

        $limit = isset($_GET['limit']) && $_GET['limit'] > 0 ? ' LIMIT '.$_GET['limit'] : '';
        $query = $this->db->prepare('SELECT workout.id, workout.name, activity, `date`, `time`, duration, energy, avgHr,
            avgSpeed, avgCadence, maxSpeed, maxCadence, maxEle, minEle, eleUp, eleDown,
            maxHr, distance, note, log, files.name AS `filename`, files.size, files.type,
            gear.id as gearId, gear.brand, gear.model,
            a.id as activityId, a.name as activityName, a.color, a.icon
            FROM workout
                LEFT JOIN exported_files AS files ON workout.id = files.workoutId
                LEFT JOIN gear ON workout.gearId = gear.id
                LEFT JOIN activity as a ON workout.activity = a.id
            WHERE 1 ' . $inArray . '
            ORDER BY `date` DESC, `time` DESC' . $limit);
        $query->execute(array());

        $res = $query->fetchAll();

        $data = [];
        foreach ($res as $v) {
            $data[] = new WorkoutDto($v);
        }
        return $data;
    }

    public function findOneById($id) {
        $query = $this->db->prepare('SELECT workout.id, workout.name, activity, `date`, time, duration, energy, avgHr,
            avgSpeed, avgCadence, maxSpeed, maxCadence, maxEle, minEle, eleUp, eleDown,
            maxHr, distance, note, files.id AS log, files.name AS `filename`, files.size, files.type,
            gear.id as gearId, gear.brand, gear.model,
            a.id as activityId, a.name as activityName, a.color, a.icon
            FROM workout
                LEFT JOIN exported_files AS files ON workout.id = files.workoutId
                LEFT JOIN gear ON workout.gearId = gear.id
                LEFT JOIN activity as a ON workout.activity = a.id
            WHERE workout.id = ?');
        $query->execute(array($id));
        $res = $query->fetch();

        if (!!$res['id']) {
            return new WorkoutDto($res);
        } else {
            return null;
        }
    }

    public function deleteWorkout($id) {
        $itemQuery = $this->db->prepare('DELETE FROM workout WHERE id = ?');
        $itemQuery->execute(array($id));
        // if ($d->log->id) {
        //     $fileQuery = $this->db->prepare('DELETE FROM exported_files WHERE id = ?');
        //     $fileQuery->execute(array($d->log->id));
        // }
    }
    
    public function handleFile() {
        $raw = file_get_contents($_FILES["file"]["tmp_name"]);
        $rows = explode("\n", $raw);
        return $rows;
    }

    public function deleteWorkoutFileLog($id) {
        // $workoutUpdate = $this->db->prepare('UPDATE workout SET log = null WHERE log = ?');
        $fileDelete = $this->db->prepare('DELETE FROM exported_files WHERE id = ?');

        // $workoutUpdate->execute(array($id));
        $fileDelete->execute(array($id));
    }

    public function uploadLogFile($id) {
        
        $raw = file_get_contents($_FILES["file"]["tmp_name"]);

        $name = $_FILES["file"]["name"];
        $type = $_FILES["file"]["type"];
        $size = filesize($_FILES["file"]["tmp_name"]);

        $query = $this->db->prepare('INSERT INTO exported_files (name, type, size, content, workoutId) VALUES (?,?,?,?,?)');
        $fileStatus = $query->execute(array($name, $type, $size, $raw, $id));

        if (!!$fileStatus) {
            $insertedId = $this->db->lastInsertId();

            $log = $this->_parseBasicInfoFromLogFile($raw);
            $this->updateWorkoutWithFileLog($id, $log, $insertedId);

            // $query2 = $this->db->prepare('UPDATE workout SET log = ? WHERE id = ?');
            // $query2->execute(array($insertedId, $id));
            // return array(
            //     'id' => $insertedId,
            //     'name' => $name,
            //     'type' => $type,
            //     'size' => $size
            // );
        } else {
            return 400;
        }
    }

    public function addWorkoutCheckPoint($workout, $checkPoint) {
        $q = $this->db->prepare('INSERT INTO workout_check_point (workoutId, checkPointId) VALUES (?,?)');
        return $q->execute(array($workout, $checkPoint));
    }

    public function deleteWorkoutCheckPoint($workout, $checkPoint) {
        $q = $this->db->prepare('DELETE FROM workout_check_point WHERE workoutId = ? AND checkPointId = ?');
        return $q->execute(array($workout, $checkPoint));
    }

    public function getRouteCheckPoints($id) {
        $cpList = $this->_getListOfCheckPointsByWorkoutId($id);
        $rows = $this->_parseLogFileByWorkoutId($id);
        if (count($cpList) > 0 && count($rows) > 0) {
            $preparedData = $this->_prepareCheckPointData($rows, $cpList);
            $data = $this->_pickClosestValues($preparedData);
            return $data;
        } else if (count($cpList) > 0) {
            return $cpList;
        }
        return [];
    }

    /**
     * @param string $row add row string
     * @return object returns parsed row as an object 
     */
    private function _parseRow($row) {
        if (!$row) return null;
        $r = explode(",", $row);

        return new WahooWorkoutRowDto($r);
    }

    public function getTrackCoordinates($id) {
        $rows = $this->_parseLogFileByWorkoutId($id);
        $series = [];
        $sumLat = 0;
        $sumLon = 0;
        $segments = [];
        $active = false;
        $last = null;
        $counter = 0;
        $sum = 0;
        $c = 0;

        if (count($rows) > 0) {
            for ($i = 1; $i < count($rows); $i++) {
                $row = $this->_parseRow($rows[$i]);
                $lat = $row->latitude;
                $lon = $row->longitude;
                $active = $row->active;

                if ($lat && $lon) {
                    $counter += 1;
                    $series[] = [$lon, $lat];

                    if (!!$last && $last->active != $row->active) {
                        array_push($segments, array(
                            'active' => $last->active,
                            'series' => $series,
                            'lasttime' => $row->timestamp
                        ));
                        $series = [[$lon, $lat]];
                    }

                    $last = $this->_parseRow($rows[$i]);
                    $sumLat += $lat;
                    $sumLon += $lon;
                }
            }
        }
        array_push($segments, array(
            'active' => !!$last ? $last->active : null,
            'series' => $series,
            'lasttime' => isset($row) && !!$row ? $row->timestamp : null
        ));
        
        return array(
            'center' => array(
                'lat' => $sumLat > 0 ? $sumLat / $counter : 0,
                'lon' => $sumLon > 0 ? $sumLon / $counter : 0,
            ),
            'count' => $counter,
            'coordinates' => $segments
        );
    }

    public function findNextAndPrev($id, $filter) {
        $inArray = !!$filter->types && count($filter->types)
            ? ' AND workout.activity IN (' . implode(",", $filter->types) . ') '
            : '';
       return array(
           'prev' => $this->_findPrevWorkout($id, $filter->date, $inArray),
           'next' => $this->_findNextWorkout($id, $filter->date, $inArray)
       );
    }

    private function _findPrevWorkout($id, $date, $inArray) {
        $q = $this->db->prepare('SELECT id FROM workout WHERE `date` < ? AND id != ? '. $inArray
            . 'ORDER BY `date` DESC LIMIT 1');
        $q->execute(array($date, $id));
        $res = $q->fetch();
        return $res['id'];
    }

    private function _findNextWorkout($id, $date, $inArray) {
        $q = $this->db->prepare('SELECT id FROM workout WHERE `date` > ? AND id != ? '. $inArray
            . 'ORDER BY `date` ASC LIMIT 1');
        $q->execute(array($date, $id));
        $res = $q->fetch();
        return $res['id'];
    }

    private function _getListOfCheckPointsByWorkoutId($id) {
        $q = $this->db->prepare('SELECT cp.id, cp.name, cp.lat, cp.lon FROM workout_check_point AS wcp
            INNER JOIN check_points AS cp ON wcp.checkPointId = cp.id
            WHERE wcp.workoutId = ?');
        $q->execute(array($id));
        $res = $q->fetchAll();
        return $res;
    }

    private function _prepareCheckPointData($rows, $checkPoints) {
        $sumHr = 0;
        $sumSpeed = 0;
        $lastCpId = null;
        $lastInd = 0;
        $maxDst = 20;

        $data = [];
        $i = 0;
        $firstIndex = 0;
        $start = null;
        $lastPointId = null;
        $value = null;
        $pointDst = 0;
        $lastValue = null;

        foreach($rows as $ind => $row) {
            $r = explode(",", $row);

            if (isset($r[$this->columns['ACTIVE']]) && $r[$this->columns['ACTIVE']] == 'true') {

                if (!$start) {
                    $start = $r[$this->columns['TIMESTAMP']];
                }


                $lat = floatval($r[$this->columns['LAT']]);
                $lon = floatval($r[$this->columns['LON']]);
                $hr = floatval($r[$this->columns['HR']]);
                $speed = floatval($r[$this->columns['SPEED']]);
                $routeDst = floatval($r[$this->columns['DST']]);
                $time = ($r[$this->columns['TIMESTAMP']] - $start) / 1000;

                if ($lat && $lon) {
                    $sumHr += $hr;
                    $sumSpeed += $speed;
                    $i += 1;
                    if ($i == 2) {
                        $firstIndex = $ind;
                    }
                    $value = null;
                    
                    foreach($checkPoints as $cp) {
                        $dstPom = $this->_distanceInMBetweenEarthCoordinates($lat, $lon, floatval($cp['lat']), floatval($cp['lon']));

                        if ($dstPom < $maxDst) {
                            $value = $cp;
                            $pointDst = $dstPom;
                        }

                    }

                    // $lastValue = null;
                    if (!!$value) {
                        $data[] = array(
                            'value' => $value,
                            'record' => $r,
                            'dst' => $pointDst,
                            'sumHr' => $sumHr,
                            'sumSpeed' => $sumSpeed,
                            'start' => $start,
                            'i' => $i,
                            'index' => $ind,
                            'firstIndex' => $firstIndex,
                        );
                        // $value = null;
                        $lastValue = $value;
                    } else {
                        // echo $lastValue;
                        if (!!$lastValue) {
                            // echo 'else;';
                            $sumHr = 0;
                            $sumSpeed = 0;
                            $i = 0;
                            $firstIndex = -1;
                            $lastValue = null;
                        }
                    }
                }
                
            }
        }

        $lastRow = explode(',', $rows[count($rows) - 2]);

        $data[] = array(
            'value' => array(
                'id' => 'FINISH',
                'name' => 'Cíl',
                'lat' => floatval($lastRow[$this->columns['LAT']]),
                'lon' => floatval($lastRow[$this->columns['LON']])
            ),
            'record' => $lastRow,
            'i' => $i,
            'sumHr' => $sumHr,
            'sumSpeed' => $sumSpeed,
            'start' => $start,
            'index' => count($rows) - 2,
            'firstIndex' => $firstIndex
        );
        return $data;
    }

    private function _pickClosestValues($d) {

        $data = [];
        $lastId = null;
        $value = null;
        $lastId = $d[0]['value']['id'];
        $value = $d[0];
        foreach($d as $v) {
            if (($lastId == $v['value']['id'])
                && $value['dst'] > $v['dst']) {
                $value = $v;
            }

            if ($lastId != $v['value']['id']) {
                $data[] = $value;
                $lastId = $v['value']['id'];
                $value = $v;
            }
        }
        $data[] = $value;
        return $this->_formateCheckPoints($data);
    }

    private function _formateCheckPoints($d) {
        $data = [];
        foreach($d as $ind => $v) {
            $data[] = array(
                'id' => $v['value']['id'],
                'name' => $v['value']['name'],
                'lat' => $v['value']['lat'],
                'lon' => $v['value']['lon'],
                'data' => array(
                    'avgHr' => round(($v['sumHr'] / $v['i'])),
                    'avgSpeed' => round(($v['sumSpeed'] / $v['i']) * 3.6, 1),
                    'dst' => round($v['record'][$this->columns['DST']] / 1000, 1),
                    'splitTime' => $ind == 0
                        ? ($v['record'][$this->columns['TIMESTAMP']] - $v['start']) / 1000
                        : ($v['record'][$this->columns['TIMESTAMP']] - $d[$ind -1]['record'][$this->columns['TIMESTAMP']]) / 1000,
                    'time' => ($v['record'][$this->columns['TIMESTAMP']] - $v['start']) / 1000,
                ),
                'i' => $v['i'],
                'index' => $v['index'],
                'firstIndex' => $v['firstIndex']
            );
        }
        return $data;
    }

    private function _degreesToRadians($degrees) {
        return $degrees * pi() / 180;
    }
      
    private function _distanceInMBetweenEarthCoordinates($lat1, $lon1, $lat2, $lon2) {
        $earthRadiusKm = 6371;
      
        $dLat = $this->_degreesToRadians($lat2-$lat1);
        $dLon = $this->_degreesToRadians($lon2-$lon1);
      
        $lat1 = $this->_degreesToRadians($lat1);
        $lat2 = $this->_degreesToRadians($lat2);
      
        $a = sin($dLat/2) * sin($dLat/2) +
                sin($dLon/2) * sin($dLon/2) * cos($lat1) * cos($lat2); 
        $c = 2 * atan2(sqrt($a), sqrt(1-$a)); 
        return $earthRadiusKm * $c * 1000;
    }

    private function _parseLogFileByWorkoutId($id) {
        $file = $this->_getLogFileByWorkoutId($id);
        $raw = $file['content'];
        $rows = explode("\n", $raw);
        unset($rows[0]);
        unset($rows[count($rows) -1]);
        return $rows;
    }

    /**
     * @param content file content
     */
    private function _parseBasicInfoFromLogFile($content) {
        // 0 - Timestamp (UNIX time ms)
        // 1 - Timestamp
        // 2 - Active (T/F)
        // 3 - Latitude (deg)
        // 4 - Longitude (deg)
        // 5 - Heartrate (bpm)
        // 6 - Speed (mps)
        // 7 - Distance (m)
        // 8 - Crank Cadence (rpm)
        // 9 - Run Cadence (steps/min)
        // 10 - Elevation (m)
        // 11 Power (watts)
        $rows = explode("\n", $content);
        $maxHr = 0;
        $maxSpeed = 0;
        $maxCadence = 0;
        $eleUp = 0;
        $eleDown = 0;
        $maxEle = 0;
        $minEle = 9000;
        $eleLast = null;

        $startRow = explode(",", $rows[1]);
        $endRow = explode(",", $rows[count($rows) - 2]);

        $duration = floatval($endRow[0]) - floatval($startRow[0]);
        $distance = floatval($endRow[7]) - floatval($startRow[7]);
        $active;

        $hrSum = 0;
        $candeceSum = 0;
        $speedSum = 0;
        $activeRowsCount = 0;

        $firstNonActiveTime = 0;
        $firstNonActiveDistance = 0;

        $nonActiveTime = 0;
        $nonActiveDistance = 0;

        for ($i = 1; $i < count($rows) - 1; $i++) {
            $row = explode(",", $rows[$i]);

            $active = $row[2];

            $maxSpeed = $row[6] > $maxSpeed && $active == "true" ? floatval($row[6]) : $maxSpeed;
            $maxHr = $row[5] > $maxHr && $active == "true" ? floatval($row[5]) : $maxHr;
            $maxCadence = $row[9] > $maxCadence && $active == "true" ? floatval($row[9]) : $maxCadence;
            $ele = floatval($row[10]);

            $eleUp += $eleLast && $ele > $eleLast ? ($ele - $eleLast) : 0;
            $eleDown += $eleLast && $ele < $eleLast ? ($eleLast - $ele) : 0;
            $maxEle = $ele > $maxEle ? $ele : $maxEle;
            $minEle = $ele < $minEle && $ele > 0 ? $ele : $minEle;

            $eleLast = $ele;

            if ($active == "true") {

                $activeRowsCount += 1;
                $hrSum += floatval($row[5]);
                $candeceSum += floatval($row[9]);
                $speedSum += floatval($row[6]);

                if ($firstNonActiveTime > 0) {
                    $nonActiveTime += (floatval($row[0]) - $firstNonActiveTime);
                    $nonActiveDistance += (floatval($row[7]) - $firstNonActiveDistance);

                    $firstNonActiveTime = 0;
                    $firstNonActiveDistance = 0;
                }
            } else {
                if ($firstNonActiveTime == 0) {
                    $firstNonActiveTime = floatval($row[0]);
                    $firstNonActiveDistance = floatval($row[7]);
                }
            }
        }

        if ($firstNonActiveTime > 0) {
            $row = explode(",", $rows[count($rows) - 2]);

            $nonActiveTime += (floatval($row[0]) - $firstNonActiveTime);
            $nonActiveDistance += (floatval($row[7]) - $firstNonActiveDistance);
        }

        return array(
            'duration' => ($duration - $nonActiveTime) / 1000,
            'distance' => round(($distance - $nonActiveDistance) / 1000, 2),
            'maxHr' => round($maxHr),
            'maxSpeed' => round(($maxSpeed * 3.6), 1),
            'avgHr' => round(($hrSum) / $activeRowsCount),
            'maxCadence' => round(($maxCadence)),
            'avgCadence' => round(($candeceSum) / $activeRowsCount),
            'avgSpeed' => round((($speedSum * 3.6) / $activeRowsCount), 1),
            'date' => date('Y-m-d\TH:i:s.000\Z', floatval($startRow[0] / 1000)),
            'time' => date('H:i', floatval($startRow[0] / 1000) + 7200),
            'nonActiveTime' => $nonActiveTime / 1000,
            'nonActiveDistance' => round(($nonActiveDistance / 1000), 3),
            'maxEle' => round($maxEle),
            'minEle' => round($minEle),
            'eleUp' => round($eleUp),
            'eleDown' => round($eleDown)
        );
    }

    public function updateWorkoutWithFileLog($id, $log, $logId) {
        $query = $this->db->prepare('UPDATE workout SET
                duration = ?, distance = ?, maxHr = ?, maxSpeed = ?, maxCadence = ?, avgHr = ?, avgSpeed = ?,
                avgCadence = ?, maxEle = ?, minEle = ?, eleUp = ?, eleDown = ?, `date` = ?, `time` = ?
            WHERE id = ?');
        $query->execute(array($log['duration'], $log['distance'], $log['maxHr'], $log['maxSpeed'], $log['maxCadence'],
            $log['avgHr'], $log['avgSpeed'], $log['avgCadence'], $log['maxEle'], $log['minEle'], $log['eleUp'], $log['eleDown'],
            $log['date'], $log['time'], $id));
    }

    public function getGraphData($workoutId, $valueType = 'HR') {
        return $this->_dataToGraphFromLogFile($workoutId, $valueType);
    }

    private function _dataToGraphFromLogFile($workoutId, $valueType = 'HR') {

        $file = $this->_getLogFileByWorkoutId($workoutId);
        $col = $this->columns[$valueType];
        
        $raw = $file['content'];
        $rows = explode("\n", $raw);
        $aggr = count($rows) > 300 ? ceil(count($rows) / 300) : 1;

        if ($valueType != 'ELE') {
            $counter = 0;
            $sum = 0;
            $series = [];
            $c = 0;
            $start = 0;
            
            $multiplier = $this->multiplier[$valueType];
            $round = $valueType === 'SPEED'
                ? 1
                : 0;

            for ($i = 1; $i < count($rows) - 2; $i++) {
                $row = explode(",", $rows[$i]);

                if ($i == 1) { $start = floatval($row[$this->columns['TIMESTAMP']]); }

                $hrMultiplier = $this->_correctHrMultiplier($start);
                $value = ($valueType == 'HR')
                    ? floatval(($row[$col] * $hrMultiplier))
                    : floatval($row[$col]);
                
                $sum += $value;
                $c = $row[10];

                $counter += 1;
                if ($counter >= $aggr) {
                    // $time = explode(":", $row[$this->columns['TIME']]);
                    $time = $row[$this->columns['TIMESTAMP']] - $start;
                    $series[] = array(
                        'name' => $valueType != 'ELE'
                            ? $this->_secToTime(floatval($time > 0 ? ($time) / 1000 : 0))
                            // ? $time[0].":".$time[1].":".$time[2]
                            : ceil($row[$this->columns['DST']]),
                        'value' => round(($sum / $aggr) * $multiplier, $round),
                    );
                    $counter = 0;
                    $sum = 0;
                }
            }

            $a = array(
                'name' => $valueType,
                'series' => $series,
            );
            $b = array($a);
            return $b;
        } else {
            return $this->_getRouteProfile($rows);
        }
    }

    private function _getRouteProfile($rows) {
        $counter = 0;
        $sum = 0;
        $series = [];
        $size = count($rows);
        $lastRow = explode(",", $rows[$size - 2]);

        $totalDst = ceil(floatval($lastRow[$this->columns['DST']]));
        $step = $size > 300 ? round($totalDst / 300) : 1;

        $lastDst = 0;

        for ($i = 1; $i < ($size - 1); $i++) {
            $row = explode(",", $rows[$i]);
            $ele = floatval($row[$this->columns['ELE']]);
            $dst = floatval($row[$this->columns['DST']]);

            if ($dst > $lastDst) {
                $series[] = array(
                    'name' => ceil($dst),
                    'value' => round($ele, 0)
                );
                $lastDst += $step;
            }
        }

        $a = array(
            'name' => 'ELE',
            'series' => $series
        );
        $b = array($a);
        return $b;
    }

    private function _correctHrMultiplier($timestamp) {
        $breakpoint = strtotime("2018-05-07 00:00:00");
        $date = $timestamp / 1000;
        return $date < $breakpoint ? 60 : 1;
    }

    private function _getLogFileByWorkoutId($id) {
        $query = $this->db->prepare('SELECT files.id, files.name, `type`, size, content
            FROM workout LEFT JOIN exported_files AS files ON workout.id = files.workoutId WHERE workout.id = ?');
        $query->execute(array($id));
        return $query->fetch();
    }

    public function getLogFile($id) {
        $file = $this->_getLogFileByWorkoutId($id);

        return !!$file ? $file['content'] : null;
    }

    public function createCsvTempFile() {
        $raw = file_get_contents($_FILES["file"]["tmp_name"]);

        $name = $_FILES["file"]["name"];
        $type = $_FILES["file"]["type"];
        $size = filesize($_FILES["file"]["tmp_name"]);
        $lat = isset($_POST['lat']) ? $_POST['lat'] : null;
        $lon = isset($_POST['lon']) ? $_POST['lon'] : null;
        $ele = isset($_POST['ele']) ? $_POST['ele'] : null;

        $query = $this->db->prepare('INSERT INTO temp_files (name, type, size, lat, lon, elevation, content) VALUES (?,?,?,?,?,?,?)');
        $fileStatus = $query->execute(array($name, $type, $size, $lat, $lon, $ele, $raw));
        return $this->db->lastInsertId();
    }

    private function _getTempFileById($id) {
        $query = $this->db->prepare('SELECT name, type, size, lat, lon, elevation, content FROM temp_files WHERE id = ?');
        $query->execute(array($id));
        return $query->fetch();
    }

    private function _deleteTempFIle($id) {
        $query = $this->db->prepare('DELETE FROM temp_files WHERE id = ?');
        $query->execute(array($id));
    }

    public function csv2gpx($id) {

        $file = $this->_getTempFileById($id);

        $raw = $file['content'];
        $name = $file['name'];
        $type = $file["type"];
        $size = $file["size"]; 
        $defLat = $file['lat'];
        $defLon = $file['lon'];
        $defEle = $file['elevation'];
        
        $rows = explode("\n", $raw);

        $firstRow = explode(",", $rows[1]);

        $date = date("Y-m-d", floatval($firstRow[0]) / 1000);
        $hrMultiplier = $this->_correctHrMultiplier($firstRow[0]);

        $myfile = fopen("parsed.gpx", "w") or die("Unable to open file!");

        fwrite($myfile, $this->_buildHeader($date));

        for ($i = 1; $i < count($rows) - 2; $i++) {
            $row = explode(",", $rows[$i]);

            $lat = $defLat ? $defLat : floatval($row[$this->columns['LAT']]);
            $lon = $defLon ? $defLon : floatval($row[$this->columns['LON']]);
            $ele = $defEle ? $defEle : floatval($row[$this->columns['ELE']] * $this->multiplier['ELE']);
            $hr = round(floatval($row[$this->columns['HR']] * $hrMultiplier));
            $cad = round(floatval($row[$this->columns['CAD']] * $this->multiplier['CAD']));

            $time = date('Y-m-d\TH:i:sP', ($row[$this->columns['TIMESTAMP']] / 1000));

            fwrite($myfile, '<trkpt lat="'.$lat.'" lon="'.$lon.'">');
            fwrite($myfile, '<ele>'.$ele.'</ele>');
            fwrite($myfile, '<time>'.$time.'</time>');
            fwrite($myfile, '<extensions>');
            fwrite($myfile, '<gpxtpx:TrackPointExtension>');
            fwrite($myfile, '<gpxtpx:hr>'.$hr.'</gpxtpx:hr>');
            fwrite($myfile, '<gpxtpx:cad>'.$cad.'</gpxtpx:cad>');
            fwrite($myfile, '</gpxtpx:TrackPointExtension>');
            fwrite($myfile, '</extensions>');
            fwrite($myfile, '</trkpt>');
        }

        fwrite($myfile, '</trkseg></trk></gpx>');
        fclose($myfile);

        $this->_deleteTempFIle($id);
        return $name;
    }

    private function _buildHeader($date) {
        return '<?xml version="1.0" encoding="UTF-8" standalone="no"?><gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" creator="Sports Tracker" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd"><metadata><name>' . $date . '</name><author><name>Martin</name></author><link href="www.sports-tracker.com"><text>Sports Tracker</text></link></metadata><trk><trkseg>';
    }

    public function getAllByDateRange($from = null, $to = null, $types) {
        $from = $from == 'null' ? NULL : $from;
        $to = $to == 'null' ? NULL : $to;
        if ($from && !!$to) {
            $res = $this->_findAllByDateRange($from, $to, $types);
        } else if (!!$from && !$to) {
            $res = $this->_findAllfromDate($from, $types);
        } else if (!$from && !!$to) {
            $res = $this->_findAllToDate($to, $types);
        } else {
            return $this->findAll($types);
        }

        $data = [];
        for ($i = 0; $i < count($res); $i++) {
            $data[] = new WorkoutDto($res[$i]);
        }

        return $data;
    }

    private function _findAllByDateRange($from, $to, $types) {
        $inArray = !!$types && count($types)
            ? ' AND workout.activity IN (' . implode(",", $types) . ') '
            : '';

        $query = $this->db->prepare('SELECT workout.id, workout.name, activity, `date`, `time`, duration, energy, avgHr,
        avgSpeed, avgCadence, maxSpeed, maxCadence, maxEle, minEle, eleUp, eleDown,
        maxHr, distance, note, log, files.name AS `filename`, files.size, files.type,
        gear.id as gearId, gear.brand, gear.model,
        a.id as activityId, a.name as activityName, a.color, a.icon
        FROM workout
            LEFT JOIN exported_files AS files ON workout.id = files.workoutId
            LEFT JOIN gear ON workout.gearId = gear.id
            LEFT JOIN activity as a ON workout.activity = a.id
        WHERE workout.date >= ? AND workout.date <= ?
        ' . $inArray . '
        ORDER BY `date` DESC, `time` DESC');
        $query->execute(array($from, $to));
        return $query->fetchAll();
    }

    private function _findAllfromDate($from, $types) {
        $inArray = !!$types && count($types)
            ? ' AND workout.activity IN (' . implode(",", $types) . ') '
            : '';
        
        $query = $this->db->prepare('SELECT workout.id, workout.name, activity, `date`, `time`, duration, energy, avgHr,
        avgSpeed, avgCadence, maxSpeed, maxCadence, maxEle, minEle, eleUp, eleDown,
        maxHr, distance, note, log, files.name AS `filename`, files.size, files.type,
        gear.id as gearId, gear.brand, gear.model,
        a.id as activityId, a.name as activityName, a.color, a.icon
        FROM workout
            LEFT JOIN exported_files AS files ON workout.id = files.workoutId
            LEFT JOIN gear ON workout.gearId = gear.id
            LEFT JOIN activity as a ON workout.activity = a.id
        WHERE workout.date >= ?' . $inArray . '
        ORDER BY `date` DESC, `time` DESC');
        $query->execute(array($from));
        return $query->fetchAll();
    }

    private function _findAllToDate($to, $types) {
        $inArray = !!$types && count($types)
            ? ' AND workout.activity IN (' . implode(",", $types) . ') '
            : '';

        $query = $this->db->prepare('SELECT workout.id, workout.name, activity, `date`, `time`, duration, energy, avgHr,
        avgSpeed, avgCadence, maxSpeed, maxCadence, maxEle, minEle, eleUp, eleDown,
        maxHr, distance, note, log, files.name AS `filename`, files.size, files.type,
        gear.id as gearId, gear.brand, gear.model,
        a.id as activityId, a.name as activityName, a.color, a.icon
        FROM workout
            LEFT JOIN exported_files AS files ON workout.id = files.workoutId
            LEFT JOIN gear ON workout.gearId = gear.id
            LEFT JOIN activity as a ON workout.activity = a.id
        WHERE workout.date <= ?
        ' . $inArray . '
        ORDER BY `date` DESC, `time` DESC');
        $query->execute(array($to));
        return $query->fetchAll();
    }

    private function _secToTime($s) {
        $hod = 0;
        $min = 0;
        $sec = 0;

        if ($s >= 3600) {
            $hod = floor($s / 3600);
            $s -= ($hod * 3600);
        }
        if ($s >= 60) {
            $min = floor($s / 60);
            $s -= $min * 60;
        }
        $sec = $s;
        return ($hod < 10 ? '0'.$hod : $hod) .':'.($min < 10 ? '0'.$min : $min).':'.($sec < 10 ? '0'.$sec : $sec);
    }

    public function analyzeWorkoutHr($id, $max) {
        $workout = $this->findOneById($id);
        $raw = $this->getLogFile($id);

        if ($raw) {

            $rows = explode("\n", $raw);
        
            $colsPom = explode(",", $rows[1]);
            
            $start = $colsPom[$this->columns['TIMESTAMP']];
            $multiplier = $this->_correctHrMultiplier($start);

            $ranges = $this->_createHrZonesRanges($max);
            $res = [];

            $res = array(
                'rest' => 0,
                strval(round(0.6 * $max)) => 0,
                strval(round(0.65 * $max)) => 0,
                strval(round(0.7 * $max)) => 0,
                strval(round(0.75 * $max)) => 0,
                strval(round(0.8 * $max)) => 0,
                strval(round(0.85 * $max)) => 0,
                strval(round(0.9 * $max)) => 0,
                strval(round(0.95 * $max)) => 0,
            );

            for ($i = 1; $i < count($rows) - 2; $i++) {
                $cols = explode(",", $rows[$i]);
                $hr = floatval($cols[$this->columns['HR']]);
                $hr = round($hr * $multiplier);
                $added = false;

                if ($cols[$this->columns['ACTIVE']] == 'true') {
                    foreach($ranges as $v) {
                        if ($this->_isInHrRange($v[0], $v[1], $hr)) {
                            $res[$v[0]] += 1;
                            $added = true;
                            break;
                        }
                    }

                    if ($added == false) {
                        $res['rest'] += 1;
                    }
                }
            }

            $maxDuration = 0;
            $workoutTime = 0;
            foreach($res as $ind => $r) {
                $maxDuration = $r > $maxDuration ? $r : $maxDuration;
                $workoutTime += $ind != 'rest' ? $r : 0;
            }

            return array(
                'zones' => $res,
                'maxDuration' => $maxDuration,
                'workoutTime' => $workoutTime,
                'ranges' => $ranges
            );
        } else {
            return array(
                'zones' => null,
                'maxDuration' => 0,
                'workoutTime' => 0,
                'ranges' => null
            );
        }

    }

    private function _createHrZonesRanges($max) {
        $range = [];
        $i = 60;
        do {
            $range[] = [
                round(($i / 100) * $max),
                round((($i + 5) / 100) * $max)
            ];
            $i += 5;
        } while ($i < 100);
        return $range;
    }

    private function _isInHrRange($from, $to, $hr) {
        return $hr >= $from && $hr < $to
            ? true
            : false;
    }

    public function compareRoutes($id1, $id2) {
        $r1 = $this->getLogFile($id1);
        $r2 = $this->getLogFile($id2);

        $similarity = $this->routeComparer->compareRoutes($r1, $r2);
        return array('similarity' => $similarity);
    }

    public function findSameRoutes($workout) {
        $r1 = $this->getLogFile($workout->id);
        $r2 = null;
        // $r2 = $this->getLogFile($id2);
        $similarWorkouts = $this->findWorkoutsForComparison($workout);

        $foundWorkouts = [];

        if (!!$similarWorkouts && count($similarWorkouts) > 0) {
            for ($i = 0; $i < count($similarWorkouts); $i++) {
                $r2 = $this->getLogFile($similarWorkouts[$i]['id']);
                $s = $this->routeComparer->compareRoutes($r1, $r2);
                if ($s['similarity'] > 0.9) {
                    $foundWorkouts[] = $similarWorkouts[$i]['id'];
                    // $this->logger->addInfo('similar workout id: '.$similarWorkouts[$i]['id']);
                }
            }
        }

        // $similarity = $this->routeComparer->compareRoutes($r1, $r2);
        // return array('similarity' => $similarity);
        if (count($foundWorkouts)) {
            $this->_insertSameWorkouts($workout->id, $foundWorkouts);
        }
        return $foundWorkouts;
    }

    private function findWorkoutsForComparison($workout) {
        $minDst = $workout->distance - 1;
        $maxDst = $workout->distance + 1;
        $q = $this->db->prepare('SELECT w.id
            FROM workout AS w
            INNER JOIN exported_files AS f ON w.id=f.workoutId
            WHERE w.id != ? AND w.activity = ? AND (w.distance BETWEEN ? AND ?)');
        $q->execute(array($workout->id, $workout->activity->id, $minDst, $maxDst));
        return $q->fetchAll();
    }

    /**
     * @param workoutId - original workout id
     * @param foundWorkoutIds - array of found workout ids
     */
    private function _insertSameWorkouts($workoutId, $foundWorkoutIds) {
        // Delete existing references before inserting the new ones
        $this->_deleteSameWorkouts($workoutId);

        $values = '';
        for($i = 0; $i < count($foundWorkoutIds); $i++) {
            if (!!$values) {
                $values .= ', ';
            }
            $values .= '('.$workoutId.', '.$foundWorkoutIds[$i].')';
        }
        $this->logger->addInfo($values);
        $q = $this->db->prepare('INSERT INTO same_workouts (workoutId, foundWorkoutId) VALUES '.$values);
        $q->execute(array());
    }

    private function _deleteSameWorkouts($id) {
        $q = $this->db->prepare('DELETE FROM same_workouts WHERE workoutId = ?');
        $q->execute(array($id));
    }

    public function getSameWorkouts($id) {

        $q = $this->db->prepare('SELECT foundWorkoutId FROM same_workouts WHERE workoutId = ?');
        $q->execute(array($id));
        $res = $q->fetchAll();
        
        if (!!$res) {
            $arr = '';
            for ($i = 0; $i < count($res); $i++) {
                if ($arr) {
                    $arr .= ',';
                }
                $arr .= $res[$i]['foundWorkoutId'];
            }

            $query = $this->db->prepare('SELECT workout.id, workout.name, activity, `date`, `time`, duration, energy, avgHr,
            avgSpeed, avgCadence, maxSpeed, maxCadence, maxEle, minEle, eleUp, eleDown,
            maxHr, distance, note, log, files.name AS `filename`, files.size, files.type,
            gear.id as gearId, gear.brand, gear.model,
            a.id as activityId, a.name as activityName, a.color, a.icon
            FROM workout
                LEFT JOIN exported_files AS files ON workout.id = files.workoutId
                LEFT JOIN gear ON workout.gearId = gear.id
                LEFT JOIN activity as a ON workout.activity = a.id
            WHERE workout.id IN ('.$arr.') ORDER BY duration DESC');
            $query->execute(array());
            $res = $query->fetchAll();
    
            if (!!$res) {
                $data = [];
                forEach($res as $r) {
                    $data[] = new WorkoutDto($r);
                }
                return $data;
            }

        } else {
            return [];
        }
    }
}