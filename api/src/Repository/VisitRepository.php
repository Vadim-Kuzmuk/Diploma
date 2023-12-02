<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Visit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Visit>
 *
 * @method Visit|null find($id, $lockMode = null, $lockVersion = null)
 * @method Visit|null findOneBy(array $criteria, array $orderBy = null)
 * @method Visit[]    findAll()
 * @method Visit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VisitRepository extends ServiceEntityRepository
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Visit::class);
    }

    /**
     * @param User $user
     * @param int $itemsPerPage
     * @param int $page
     * @return array
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function getFutureVisits(User $user, int $itemsPerPage, int $page): array
    {
        $selectedFields = [
            "visit.id",
            "visit.date",
            "visit.link",
            "visit.duration",
            "visit.price",
            "visit.conclusion",
            "visit.isPaid",
            "doctor.firstName as doctorFirstName",
            "doctor.lastName as doctorLastName",
            "room.name as roomName",
            "room.number as roomNumber",
            "speciality.title as specialityTitle"
        ];

        $visits = $this->createQueryBuilder("visit")
            ->andWhere('visit.date >= :now')
            ->andWhere('visit.client = :client')
            ->setParameter('now', time())
            ->setParameter('client', $user->getId()->toBinary())
            ->join("visit.doctor", "doctor")
            ->join("doctor.doctorInfo", "docInfo")
            ->join("docInfo.speciality", "speciality")
            ->leftjoin("visit.room", "room")
            ->select(implode(", ", $selectedFields))
            ->setFirstResult($itemsPerPage * ($page - 1))
            ->setMaxResults($itemsPerPage)
            ->orderBy("visit.date", "ASC")
            ->getQuery()
            ->getArrayResult();

        $count = $this->createQueryBuilder("visit")
            ->andWhere('visit.date >= :now')
            ->andWhere('visit.client = :client')
            ->setParameter('now', time())
            ->setParameter('client', $user->getId()->toBinary())
            ->select('COUNT(visit.id)')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            "count"  => $count,
            "visits" => $visits
        ];
    }

    /**
     * @param User $user
     * @param int $itemsPerPage
     * @param int $page
     * @return array
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function getVisitsHistory(User $user, int $itemsPerPage, int $page): array
    {
        $selectedFields = [
            "visit.id",
            "visit.date",
            "visit.link",
            "visit.duration",
            "visit.price",
            "visit.conclusion",
            "visit.isPaid",
            "doctor.firstName as doctorFirstName",
            "doctor.lastName as doctorLastName",
            "room.name as roomName",
            "room.number as roomNumber",
            "speciality.title as specialityTitle"
        ];

        $visits = $this->createQueryBuilder("visit")
            ->andWhere('visit.date < :now')
            ->andWhere('visit.client = :client')
            ->setParameter('now', time())
            ->setParameter('client', $user->getId()->toBinary())
            ->join("visit.doctor", "doctor")
            ->join("doctor.doctorInfo", "docInfo")
            ->join("docInfo.speciality", "speciality")
            ->leftJoin("visit.room", "room")
            ->select(implode(", ", $selectedFields))
            ->setFirstResult($itemsPerPage * ($page - 1))
            ->setMaxResults($itemsPerPage)
            ->orderBy("visit.date", "DESC")
            ->getQuery()
            ->getArrayResult();

        $count = $this->createQueryBuilder("visit")
            ->andWhere('visit.date < :now')
            ->andWhere('visit.client = :client')
            ->setParameter('now', time())
            ->setParameter('client', $user->getId()->toBinary())
            ->select('COUNT(visit.id)')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            "count"  => $count,
            "visits" => $visits
        ];
    }

}

