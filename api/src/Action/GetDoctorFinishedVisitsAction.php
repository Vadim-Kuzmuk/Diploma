<?php

namespace App\Action;

use App\Entity\User;
use App\Entity\Visit;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class GetDoctorFinishedVisitsAction
{

    const DEFAULT_ITEMS_PER_PAGE = 5;
    const DEFAULT_PAGE           = 1;

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
     * @param string $id
     * @return mixed
     */
    public function __invoke(string $id, Request $request): mixed
    {
        /** @var User $doctor */
        $doctor = $this->entityManager->getRepository(User::class)
            ->findOneBy([
                "id" => $id
            ]);

        if (!$doctor) {
            throw new UnprocessableEntityHttpException("Can`t find doctor with id " . $id);
        }

        if (!in_array(User::ROLE_DOCTOR, $doctor->getRoles())) {
            throw new UnprocessableEntityHttpException("Given user is not a doctor");
        }

        $requestData = $request->query->all();

        return $this->entityManager->getRepository(User::class)->getDoctorFinishedVisits(
            $doctor->getId(),
            $requestData["itemsPerPage"] ?? self::DEFAULT_ITEMS_PER_PAGE,
            $requestData["page"] ?? self::DEFAULT_PAGE);
    }

}