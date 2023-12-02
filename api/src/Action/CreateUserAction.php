<?php

namespace App\Action;

use App\Entity\ClientInfo;
use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class CreateUserAction
{

    /**
     * @var UserPasswordHasherInterface
     */
    private UserPasswordHasherInterface $passwordHasher;

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @param UserPasswordHasherInterface $passwordHasher
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager)
    {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
    }

    /**
     * @param User $data
     * @return User
     */
    public function __invoke(User $data): User
    {
        if (!$data->getPlainPassword()) {
            return $data;
        }

        $data = $this->hashUserPassword($data);

        if (empty($data->getRoles())) {
            $data->setRoles([User::ROLE_CLIENT]);
        }

        if (empty($data->getClientInfo())) {
            $clientInfo = new ClientInfo();
            $clientInfo->setUser($data)->setFamily(null)->setIsParent(false);
            $this->entityManager->persist($clientInfo);
        }

        return $data;
    }

    /**
     * @param User $data
     * @return User
     */
    public function hashUserPassword(User $data): User
    {
        $hashedPassword = $this->passwordHasher->hashPassword(
            $data,
            $data->getPlainPassword()
        );

        $data->setPassword($hashedPassword)
            ->eraseCredentials();

        return $data;
    }

}