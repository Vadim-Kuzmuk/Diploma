<?php

namespace App\Repository;

use App\Entity\ReceptionTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<ReceptionTime>
 *
 * @method ReceptionTime|null find($id, $lockMode = null, $lockVersion = null)
 * @method ReceptionTime|null findOneBy(array $criteria, array $orderBy = null)
 * @method ReceptionTime[]    findAll()
 * @method ReceptionTime[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReceptionTimeRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReceptionTime::class);
    }

    /**
     * @param string $doctorId
     * @param string $day
     * @return mixed
     */
    public function getDoctorsReceptionTimeByDay(string $doctorId, string $day): mixed
    {

        $uuid = Uuid::fromString($doctorId)->toBinary();

        return $this->createQueryBuilder('recTime')
            ->select('recTime.id', 'recTime.start', 'recTime.end')

            ->andWhere('recTime.doctor = :doctorId')
            ->setParameter("doctorId", $uuid)

            ->andWhere("recTime.start >= :day AND recTime.end < :day + (24*3600)")
            ->setParameter("day", $day)

            ->getQuery()
            ->getResult();
    }

}
