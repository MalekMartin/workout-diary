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

    public $path = '../../files';

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function convertToGpx($id) {

        $fileName = $this->_getLogFileByWorkoutId($id);

        if (!$fileName) {
            return 'NO_FILE';
        }

        try {
            $raw = file_get_contents($this->path.'/'.$fileName);
        } catch (Exception $e) {
            return 'NO_CONTENT';
        }

        if (!$raw || strLen($raw) <= 0) {
            return 'NO_CONTENT';
        }
        
        $rows = explode("\n", $raw);
        $firstRow = explode(",", $rows[1]);

        $date = date("Y-m-d", floatval($firstRow[0]) / 1000);
        $myfile = fopen("parsed.gpx", "w") or die("Unable to open file!");

        fwrite($myfile, $this->_buildGpxHeader($date));

        $text = '';

        for ($i = 1; $i < count($rows) - 2; $i++) {
            $gpxBody .= $i . ', ';
            $row = explode(",", $rows[$i]);

            $lat = floatval($row[$this->columns['LAT']]);
            $lon = floatval($row[$this->columns['LON']]);
            $ele = floatval($row[$this->columns['ELE']]);
            $hr = round(floatval($row[$this->columns['HR']]));
            $cad = round(floatval($row[$this->columns['CAD']]));

            $time = date('Y-m-d\TH:i:sP', ($row[$this->columns['TIMESTAMP']] / 1000));

            $text .= '<trkpt lat="'.$lat.'" lon="'.$lon.'">';
            $text .= '<ele>'.$ele.'</ele>';
            $text .= '<time>'.$time.'</time>';
            $text .= '<extensions>';
            $text .= '<gpxtpx:TrackPointExtension>';
            $text .= '<gpxtpx:hr>'.$hr.'</gpxtpx:hr>';
            $text .= '<gpxtpx:cad>'.$cad.'</gpxtpx:cad>';
            $text .= '</gpxtpx:TrackPointExtension>';
            $text .= '</extensions>';
            $text .= '</trkpt>';
        }

        fwrite($myfile, $text.'</trkseg></trk></gpx>');
        fclose($myfile);

        return 'exported';
    }

    // Used as a one time function to export all files from DB
    // function saveAllFiles() {
    //     $query = $this->db->prepare('SELECT name, content FROM exported_files ef');
    //     $query->execute(array());
    //     $files = $query->fetchAll();

    //     $path = '../../files';

    //     try {
    //         mkdir($path, 0777);
    //     } catch (Exception  $e) {
    //         echo 'Directory cannot be created' . $e->getMessage() . '\n';
    //     }
    //     foreach($files as $f) {
    //         $new = fopen($path.'/'.$f['name'], 'w');
    //         fwrite($new, $f['content']);
    //         fclose($new);;
    //         $new = null;
    //     }
    // }

    private function _getLogFileByWorkoutId($id) {
        $query = $this->db->prepare('SELECT name
            FROM exported_files WHERE workoutId = ?');
        $query->execute(array($id));
        $file = $query->fetch();
        return !!$file && isset($file['name']) ? $file['name'] : null;
    }

    private function _buildGpxHeader($date) {
        return '<?xml version="1.0" encoding="UTF-8" standalone="no"?><gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" creator="Sports Tracker" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd"><metadata><name>' . $date . '</name><author><name>Martin</name></author><link href="www.sports-tracker.com"><text>Sports Tracker</text></link></metadata><trk><trkseg>';
    }
}