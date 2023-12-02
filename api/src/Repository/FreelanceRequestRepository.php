<?php

namespace App\Repository;

use App\Entity\FreelanceRequest;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FreelanceRequest>
 *
 * @method FreelanceRequest|null find($id, $lockMode = null, $lockVersion = null)
 * @method FreelanceRequest|null findOneBy(array $criteria, array $orderBy = null)
 * @method FreelanceRequest[]    findAll()
 * @method FreelanceRequest[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FreelanceRequestRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FreelanceRequest::class);
    }

}
