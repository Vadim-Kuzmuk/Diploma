<?php

namespace App\Action;

use App\Entity\ReceptionTime;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Security;

class GetDoctorReceptionTimesAction
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
     * @param Request $request
     * @return array
     */
    public function __invoke(string $id, Request $request): array
    {
        $requestData = $request->query->all();

        if(!$requestData['day']){
            throw new UnprocessableEntityHttpException("Day not given");
        }

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

        return $this->entityManager->getRepository(ReceptionTime::class)->getDoctorsReceptionTimeByDay($id, $requestData['day']);

    }

}