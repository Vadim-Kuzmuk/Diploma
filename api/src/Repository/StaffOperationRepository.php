<?php

namespace App\Repository;

use App\Entity\StaffOperation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StaffOperation>
 *
 * @method StaffOperation|null find($id, $lockMode = null, $lockVersion = null)
 * @method StaffOperation|null findOneBy(array $criteria, array $orderBy = null)
 * @method StaffOperation[]    findAll()
 * @method StaffOperation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StaffOperationRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StaffOperation::class);
    }

}
