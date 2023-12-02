<?php

namespace App\Repository;

use App\Entity\StaffInfo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StaffInfo>
 *
 * @method StaffInfo|null find($id, $lockMode = null, $lockVersion = null)
 * @method StaffInfo|null findOneBy(array $criteria, array $orderBy = null)
 * @method StaffInfo[]    findAll()
 * @method StaffInfo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StaffInfoRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StaffInfo::class);
    }

}
