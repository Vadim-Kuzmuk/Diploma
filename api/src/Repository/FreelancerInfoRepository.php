<?php

namespace App\Repository;

use App\Entity\FreelancerInfo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FreelancerInfo>
 *
 * @method FreelancerInfo|null find($id, $lockMode = null, $lockVersion = null)
 * @method FreelancerInfo|null findOneBy(array $criteria, array $orderBy = null)
 * @method FreelancerInfo[]    findAll()
 * @method FreelancerInfo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FreelancerInfoRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FreelancerInfo::class);
    }

}
