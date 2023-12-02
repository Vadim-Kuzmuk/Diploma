<?php

namespace App\Repository;

use App\Entity\DoctorInfo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DoctorInfo>
 *
 * @method DoctorInfo|null find($id, $lockMode = null, $lockVersion = null)
 * @method DoctorInfo|null findOneBy(array $criteria, array $orderBy = null)
 * @method DoctorInfo[]    findAll()
 * @method DoctorInfo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DoctorInfoRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DoctorInfo::class);
    }

}
