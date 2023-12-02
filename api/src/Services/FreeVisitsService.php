<?php

namespace App\Services;

use App\Entity\DoctorInfo;
use App\Entity\ReceptionTime;

class FreeVisitsService
{

    /**
     * @param DoctorInfo $doctorInfo
     * @param ReceptionTime $receptionTime
     * @return array
     */
    public function getFreeVisits(DoctorInfo $doctorInfo, ReceptionTime $receptionTime, int $timeZoneOffset = 0): array
    {
        $visits = $doctorInfo->getUser()->getDoctorVisits()
            ->filter(fn($item) => $item->getDate() + $item->getDuration() * 60 > $receptionTime->getStart() &&
                $item->getDate() < $receptionTime->getEnd()
            );


        $durationSeconds = $doctorInfo->getDuration() * 60;

        if ($receptionTime->getEnd() - $receptionTime->getStart() < $durationSeconds) {
            return [];
        }

        return array_filter(
            range($receptionTime->getStart(), $receptionTime->getEnd(), $durationSeconds),
            fn($item) => $visits->filter(
                    fn($visit) => $visit->getDate() < $item + $durationSeconds && $visit->getDate() + $visit->getDuration() * 60 > $item
                )->count() == 0 && $item <= $receptionTime->getEnd() - $durationSeconds
        );
    }

}


