<?php

namespace App\Action;

use App\Entity\DoctorInfo;
use App\Entity\ReceptionTime;
use App\Entity\User;
use App\Entity\Visit;
use App\Services\FreeVisitsService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class GetDoctorScheduleDaysAction
{

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param Request $request
     * @param string $id
     * @param FreeVisitsService $freeVisitsService
     * @return array
     */
    public function __invoke(Request $request, string $id, FreeVisitsService $freeVisitsService): array
    {
        /** @var User $doctor */
        $doctor = $this->entityManager->getRepository(User::class)
            ->findOneBy(
                ['id' => $id]
            );

        if (!$doctor) {
            throw new UnprocessableEntityHttpException("Can`t find doctor with id " . $id);
        }

        if (!in_array(User::ROLE_DOCTOR, $doctor->getRoles())) {
            throw new UnprocessableEntityHttpException("Given user is not a doctor");
        }

        /** @var DoctorInfo $doctorInfo */
        $doctorInfo = $this->entityManager->getRepository(DoctorInfo::class)
            ->findOneBy([
                'user' => $doctor->getId()
            ]);

        if (!$doctorInfo) {
            throw new UnprocessableEntityHttpException("No doctorInfo found for given user");
        }

        $timezoneOffset = $request->headers->get('Timezone-Offset') * 60;

        $receptionTimes = $doctor
            ->getReceptionTimes()
            ->filter(fn($item) => $item->getEnd() > time() - $timezoneOffset)
            ->filter(fn($item) => !empty($freeVisitsService->getFreeVisits($doctorInfo, $item, $timezoneOffset)));

        return array_unique(array_values($receptionTimes->map(fn($item) => floor($item->getStart() / 86400) * 86400 + $timezoneOffset)->toArray()));
    }

}