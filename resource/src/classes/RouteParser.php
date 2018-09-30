<?php
class RouteParser {

    public function __construct($logger) {
        $this->logger = $logger;
    }

    public function parseCsvContent($content) {

        $rows = $this->_splitContentToRows($content);

        return $this->_parseRows($rows);
    }

    private function _splitContentToRows($raw) {
        $rows = explode("\n", $raw);
        unset($rows[0]);
        unset($rows[count($rows) -1]);
        return $rows;
    }


    private function _parseRows($rows) {
        $res = [];

        for ($i = 0; $i < count($rows); $i ++) {
            if (isset($rows[$i])) {
                
                $parsed = $this->_parseRow($rows[$i]);
                if ($parsed['latitude'] > 0 && $parsed['longitude'] > 0) {
                    $res[] = $parsed;
                }
            }
        }

        return $res;
    }

    private function _parseRow($row) {
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
        $r = explode(",", $row);

        $res = array(
            'unix_timestamp' => isset($r[0]) ? floatval($r[0]) : 0,
            'timestamp' => isset($r[1]) ? $r[1] : '',
            'active' => isset($r[2]) && $r[2] === 'true' ? true : false,
            'latitude' => isset($r[3]) ? floatval($r[3]) : 0,
            'longitude' => isset($r[4]) ? floatval($r[4]) : 0,
            'heartrate' => isset($r[5]) ? floatval($r[5]) : 0,
            'speed' => isset($r[6]) ? floatval($r[6]) : 0,
            'distance' => isset($r[7]) ? floatval($r[7]): 0,
            'cadence' => isset($r[8]) ? floatval($r[8]) : 0,
            'elevation' => isset($r[9]) ? floatval($r[10]) : 0,
            'power' => isset($r[11]) ? floatval($r[11]) : 0
        );

        return $res;


    }
}