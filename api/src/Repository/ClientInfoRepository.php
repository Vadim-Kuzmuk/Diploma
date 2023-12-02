<?php

namespace App\Repository;

use App\Entity\ClientInfo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ClientInfo>
 *
 * @method ClientInfo|null find($id, $lockMode = null, $lockVersion = null)
 * @method ClientInfo|null findOneBy(array $criteria, array $orderBy = null)
 * @method ClientInfo[]    findAll()
 * @method ClientInfo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientInfoRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ClientInfo::class);
    }

}
