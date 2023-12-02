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
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Security;

class GetUserVisitsAction
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
     * @param string $id
     * @param FreeVisitsService $freeVisitsService
     * @return array
     */
    public function __invoke(Request $request, string $id, FreeVisitsService $freeVisitsService): array
    {
        $user = $this->security->getUser();

        if (!$user) {
            throw new NotFoundHttpException('User not found');
        }

        $requestData = $request->query->all();

        return $this->entityManager->getRepository(Visit::class)->getFutureVisits($user, $requestData["itemsPerPage"] ?? 5,
            $requestData["page"] ?? 1);
    }

}