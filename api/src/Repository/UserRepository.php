<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @implements PasswordUpgraderInterface<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     * @param PasswordAuthenticatedUserInterface $user
     * @param string $newHashedPassword
     * @return void
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    /**
     * @param string $doctorId
     * @param int $itemPerPage
     * @param int $page
     * @return array
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function getDoctorPlannedVisits(string $doctorId, int $itemPerPage, int $page): array
    {
        $uuid = Uuid::fromString($doctorId)->toBinary();

        $visits = $this->createQueryBuilder("d")
            ->select('v.date', 'v.duration', 'v.price', 'c.firstName', 'c.lastName',
            'c.sex', 'c.birthday', 'c.phone', 'r.number')

            ->join('d.doctorVisits', 'v')
            ->join('v.client' , 'c')
            ->join('v.room', 'r')

            ->andWhere('d.id = :doctorId')
            ->setParameter('doctorId', $uuid)

            ->andWhere('v.date >= :currentTime')
            ->setParameter('currentTime', time())

            ->setFirstResult($itemPerPage * ($page-1))
            ->setMaxResults($itemPerPage)

            ->getQuery()
            ->getResult();

        $count = $this->createQueryBuilder("d")
            ->join('d.doctorVisits', 'v')

            ->andWhere('v.date >= :currentTime')
            ->setParameter('currentTime', time())

            ->andWhere('d.id = :doctorId')
            ->setParameter('doctorId', $uuid)

            ->orderBy("v.date", "DESC")

            ->select("COUNT(v.id)")

            ->getQuery()
            ->getSingleScalarResult();

        return [
            "count"  => $count,
            "visits" => $visits
        ];
    }

    /**
     * @param string $doctorId
     * @param int $itemPerPage
     * @param int $page
     * @return array
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function getDoctorFinishedVisits(string $doctorId, int $itemPerPage, int $page): array
    {
        $uuid = Uuid::fromString($doctorId)->toBinary();

        $visits = $this->createQueryBuilder("d")
            ->select('v.date', 'v.duration', 'v.price', 'c.firstName', 'c.lastName',
                'c.sex', 'c.birthday', 'c.phone', 'r.number')

            ->join('d.doctorVisits', 'v')
            ->join('v.client' , 'c')
            ->join('v.room', 'r')

            ->andWhere('d.id = :doctorId')
            ->setParameter('doctorId', $uuid)

            ->andWhere('v.date < :currentTime')
            ->setParameter('currentTime', time())

            ->setFirstResult($itemPerPage * ($page-1))
            ->setMaxResults($itemPerPage)

            ->orderBy("v.date", "ASC")

            ->getQuery()
            ->getResult();

        $count = $this->createQueryBuilder("d")
            ->join('d.doctorVisits', 'v')

            ->andWhere('v.date < :currentTime')
            ->setParameter('currentTime', time())

            ->andWhere('d.id = :doctorId')
            ->setParameter('doctorId', $uuid)

            ->select("COUNT(v.id)")

            ->getQuery()
            ->getSingleScalarResult();

        return [
            'count'  => $count,
            'visits' => $visits
        ];
    }
}
