<?php

namespace App\Repository;

use App\Entity\HistoryAccess;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<HistoryAccess>
 *
 * @method HistoryAccess|null find($id, $lockMode = null, $lockVersion = null)
 * @method HistoryAccess|null findOneBy(array $criteria, array $orderBy = null)
 * @method HistoryAccess[]    findAll()
 * @method HistoryAccess[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HistoryAccessRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HistoryAccess::class);
    }

}
