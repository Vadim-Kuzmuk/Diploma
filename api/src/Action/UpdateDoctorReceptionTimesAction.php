<?php

namespace App\Action;

use App\Entity\ReceptionTime;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

class UpdateDoctorReceptionTimesAction
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
     * @param string $id
     * @param ReceptionTime $data
     * @return ReceptionTime
     */
    public function __invoke(string $id, ReceptionTime $data): ReceptionTime
    {
        /** @var User $doctor */
        $doctor = $this->security->getUser();

        if (!in_array("ROLE_DOCTOR", $doctor->getRoles())
            || $doctor->getId() !== $data->getDoctor()->getId()) {

            throw new AccessDeniedException();
        }

        /** @var ReceptionTime $receptionTime */
        $receptionTime = $this->entityManager->getRepository(ReceptionTime::class)->findOneBy(
            [
                "id" => $id
            ]
        );

        if (!$receptionTime) {
            throw new NotFoundHttpException('Can not find reception time with id ' . $data->getId());
        }

        if (!$data->getStart() && $data->getEnd()) {
            throw new UnprocessableEntityHttpException();
        }

        $receptionTime
            ->setStart($data->getStart())
            ->setEnd($data->getEnd());

        return $receptionTime;
    }

}