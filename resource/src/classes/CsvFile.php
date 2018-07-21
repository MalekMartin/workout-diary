<?php
class CsvFile {

    private $columns = array(
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

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function convertToGpx($id) {

        $raw = $this->_getLogFileByWorkoutId($id);

        if (!isset($file)) {
            return 'NO_FILE';
        } else if (!!$file && !isset($file['content'])) {
            return 'NO_CONTENT';
        }
        
        $rows = explode("\n", $raw);
        $firstRow = explode(",", $rows[1]);

        $date = date("Y-m-d", floatval($firstRow[0]) / 1000);
        $myfile = fopen("parsed.gpx", "w") or die("Unable to open file!");

        fwrite($myfile, $this->_buildGpxHeader($date));

        for ($i = 1; $i < count($rows) - 2; $i++) {
            $gpxBody .= $i . ', ';
            $row = explode(",", $rows[$i]);

            $lat = floatval($row[$this->columns['LAT']]);
            $lon = floatval($row[$this->columns['LON']]);
            $ele = floatval($row[$this->columns['ELE']]);
            $hr = round(floatval($row[$this->columns['HR']]));
            $cad = round(floatval($row[$this->columns['CAD']]));

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

        return 'exported';
    }

    private function _getLogFileByWorkoutId($id) {
        $query = $this->db->prepare('SELECT files.id, files.name, `type`, size, content
            FROM exported_files AS files WHERE files.workoutId = ?');
        $query->execute(array($id));
        $file = $query->fetch();
        return !!$file && isset($file['content']) ? $file['content'] : null;
    }

    private function _parseLogFileByWorkoutId($id) {
        $file = $this->_getLogFileByWorkoutId($id);
        $raw = $file['content'];
        $rows = explode("\n", $raw);
        unset($rows[0]);
        unset($rows[count($rows) -1]);
        return $rows;
    }

    private function _buildGpxHeader($date) {
        return '<?xml version="1.0" encoding="UTF-8" standalone="no"?><gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" creator="Sports Tracker" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd"><metadata><name>' . $date . '</name><author><name>Martin</name></author><link href="www.sports-tracker.com"><text>Sports Tracker</text></link></metadata><trk><trkseg>';
    }
}