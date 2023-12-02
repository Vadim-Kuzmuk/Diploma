<?php

namespace App\Action;

use App\Entity\Visit;
use Doctrine\ORM\EntityManagerInterface;

class CreateLinkAction
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
     * @param Visit $data
     * @return Visit
     */
    public function __invoke(Visit $data): Visit
    {
        if ($data->getLink() || !$data->getIsPaid()) {
            return $data;
        }

        $data->setLink("url.example.com");

        return $data;
    }

}