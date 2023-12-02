<?php

namespace App\Repository;

use App\Entity\OperationLevel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OperationLevel>
 *
 * @method OperationLevel|null find($id, $lockMode = null, $lockVersion = null)
 * @method OperationLevel|null findOneBy(array $criteria, array $orderBy = null)
 * @method OperationLevel[]    findAll()
 * @method OperationLevel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OperationLevelRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OperationLevel::class);
    }

}
