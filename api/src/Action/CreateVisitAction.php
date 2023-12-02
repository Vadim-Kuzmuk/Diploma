<?php

namespace App\Action;

use App\Entity\DoctorInfo;
use App\Entity\User;
use App\Entity\Visit;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Security;

class CreateVisitAction
{

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @var Security
     */
    private Security $security;

    /**
     * @param EntityManagerInterface $entityManager
     * @param Security $security
     */
    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     * @param Request $request
     * @param Visit $data
     * @return Visit
     */
    public function __invoke(Request $request, Visit $data): Visit
    {
        $doctorId = $data->getDoctor();

        $clientEmail = $this->security->getUser()->getUserIdentifier();

        if (!$clientEmail) {
            throw new UnprocessableEntityHttpException();
        }

        /** @var User $client */
        $client = $this->entityManager->getRepository(User::class)
            ->findOneBy([
                'email' => $clientEmail
            ]);

        /** @var User $doctor */
        $doctor = $this->entityManager->getRepository(User::class)
            ->findOneBy([
                'id' => $doctorId
            ]);

        if (!$doctor) {
            throw new UnprocessableEntityHttpException();
        }

        /** @var DoctorInfo $doctorInfo */
        $doctorInfo = $this->entityManager->getRepository(DoctorInfo::class)
            ->findOneBy([
                'id' => $doctor->getDoctorInfo()->getId()
            ]);

        if (!$doctorInfo) {
            throw new UnprocessableEntityHttpException();
        }

        $formats = $doctorInfo->getFormats();

        if ((!$formats["online"] && !$data->getRoom()) || (!$formats["offline"] && $data->getRoom())) {
            throw new UnprocessableEntityHttpException();
        }

        $price = $data->getRoom() ? $doctorInfo->getVisitPrice() : $doctorInfo->getConsultationPrice();

        if (!$price || !$doctorInfo->getDuration()) {
            throw new UnprocessableEntityHttpException();
        }

        $conflictVisits = $this->entityManager->createQueryBuilder()
            ->select('visit')
            ->from(Visit::class, 'visit')
            ->andWhere($this->entityManager->getExpressionBuilder()->gt(
                'visit.date + (visit.duration * 60)',
                ':min'
            ))
            ->andWhere($this->entityManager->getExpressionBuilder()->lt(
                'visit.date',
                ':max'
            ))
            ->andWhere('visit.doctor = :doctor')
            ->setParameter('min', $data->getDate())
            ->setParameter('max', $data->getDate() + ($doctorInfo->getDuration() * 60))
            ->setParameter('doctor', $data->getDoctor()->getId()->toBinary())
            ->getQuery()
            ->getArrayResult();

        if (!empty($conflictVisits)) {
            throw new UnprocessableEntityHttpException();
        }

        $visit = new Visit();

        $visit
            ->setDate($data->getDate())
            ->setDuration($doctorInfo->getDuration())
            ->setPrice($doctorInfo->getVisitPrice() / (60 / $doctorInfo->getDuration()))
            ->setClient($client)
            ->setDoctor($doctor)
            ->setRoom($data->getRoom());

        return $visit;
    }

}