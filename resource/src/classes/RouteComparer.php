<?php
class RouteComparer {

    /**
     *  1. porovnat delku obou tras
     *  2. porovnat startovni a cilove body tras
     *  3. pokud je splnena podmina 1. a 2. porovnat pocet bodu trasy po rozdeleni (orezat delsi pole bodu na delku kratsiho pole)
     *  4. porovnat jednotlive body po rozdeleni a zkraceni
     *  5. vratit podobnost
     */

    // tolerance used for comparision of two points (in meters)
    public $tolerance = 30;
    // step used for splitting route (in meters)
    public $step = 50;
    public $parser;

    public function __construct($db, $logger)
    {
        $this->db = $db;
        $this->logger = $logger;
        $this->parser = new RouteParser($logger);
    }

    /**
     * @param $route1 - raw csv file
     * @param $route2 - raw csv file
     * @return number similarity percentage
     */
    public function compareRoutes($route1, $route2) {
        $r1 = $this->parser->parseCsvContent($route1);
        $r2 = $this->parser->parseCsvContent($route2);

        if (!count($r1)) {
            return array(
                'similarity' => 0,
                'error' => 'missing route 1'
            );
        }
        if (!count($r2)) {
            return array(
                'similarity' => 0,
                'error' => 'missing route 2'
            );
        }

        if (!$this->_hasSameStart($r1, $r2)) {
            // $this->logger->addInfo('different starting point');
            return array(
                'similarity' => 0,
                'error' => 'different starting points'
            );
        }

        if (!$this->_hasSameFinish($r1, $r2)) {
            // $this->logger->addInfo('different ending point');
            return array(
                'similarity' => 0,
                'error' => 'different ending points'
            );
        }

        if(!$this->_hasSameLength($r1, $r2)) {
            // $this->logger->addInfo('different routes length');
            return array(
                'similarity' => 0,
                'error' => 'different routes length'
            );
        }

        $routePoints1 = $this->_splitRoutePoints($r1);
        $routePoints2 = $this->_splitRoutePoints($r2);

        $difference = count($routePoints1) - count($routePoints2);        

        // $this->logger->addInfo('points length difference: '.$difference);

        if ($difference != 0) {
            if ($difference > 0) {
                $routePoints1 = array_slice($routePoints1, 0, count($routePoints2) - 1);
            } else {
                $routePoints2 = array_slice($routePoints2, 0, count($routePoints1) - 1);
            }
        }

        $length = count($routePoints1);
        $matches = 0;

        // $this->logger->addInfo('difference counted');

        $uncomparablePoints = 0;
        $comparablePoints = 0;

        // $myfile = fopen("comparision.csv", "w") or die("Unable to open file!");
        // fwrite($myfile, '');

        for($i = 0; $i < $length; $i++) {
            if (isset($routePoints1[$i]) && isset($routePoints2[$i])) {
                $matches = $this->comparePoints($routePoints1[$i], $routePoints2[$i], 0)
                    ? $matches + 1
                    : $matches;
                $comparablePoints += 1;
            } else {
                $uncomparablePoints += 1;
            }
        }
        // fclose($myfile);

        return array(
            'similarity' => ($matches / $length),
            'error' => null
        );
        // return array(
        //     'similarity' => ($matches / $length),
        //     'uncomparablePoints' => $uncomparablePoints,
        //     'comparablePoints' => $comparablePoints,
        //     'routerPointsLengthDifference' => $difference,
        // );
    }

    private function _hasSameLength($route1, $route2) {
        // $l1 = $route1[count($route1) - 1]['distance'];
        // $l2 = $route2[count($route2) - 1]['distance'];

        $l1 = 0;
        $l1count = count($route1) - 1;
        while (!!$l1) {
            $l1 = $route1[$l1count]['distance'];
            $l1count -= 1;
        }
        $l2 = 0;
        $l2count = count($route2) - 1;
        while (!!$l2) {
            $l2 = $route2[$l2count]['distance'];
            $l2count -= 1;
        }

        // $this->logger->addInfo('r1 length: '.$l1.' | r2 lenght: '.$l2);

        // return true if the difference is lower than 1 km
        return abs($l1 - $l2) <= 1;
    }

    private function _hasSameStart($route1, $route2) {
        $start = $this->comparePoints($route1[0], $route2[0], 50);
        return $start;
    }

    private function _hasSameFinish($route1, $route2) {
        $finish = $this->comparePoints($route1[count($route1) - 1], $route2[count($route2) - 1], 50);
        return $finish;
    }

    public function comparePoints($point1, $point2, $tolerance = 0, $file = null) {
        $distance =  $this->_distanceInMBetweenEarthCoordinates(
            $point1['latitude'],
            $point1['longitude'],
            $point2['latitude'],
            $point2['longitude']
        );
        $tolerance = !!$tolerance ? $tolerance : $this->tolerance;
        // $this->logger->addInfo('dist: ' . round($distance, 3).'m | tolerance: ' . $tolerance.'m');

        if ($file) {
            fwrite($file, $point1['latitude'].','.$point1['longitude'].','.$point2['latitude'].','.$point2['longitude'].','.$distance.'m'."\r\n");
        }

        return $distance <= $tolerance;
    }

    private function _splitRoutePoints($route) {
        $res = [];
        $nextStep = $this->step;

        for ($i = 0; $i < count($route); $i++) {
            if ($route[$i]['distance'] >= $nextStep) {
                $res[] = $route[$i];
                $nextStep += $this->step;
            }
        }

        return $res;
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
}