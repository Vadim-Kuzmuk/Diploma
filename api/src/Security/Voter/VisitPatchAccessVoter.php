<?php

namespace App\Security\Voter;

use App\Entity\HistoryAccess;
use App\Entity\User;
use App\Entity\Visit;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authentication\Token\JWTUserToken;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class VisitPatchAccessVoter extends Voter
{

    public const VISIT_PATCH_ACCESS_CHECK = 'VISIT_PATCH_ACCESS_CHECK';

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param string $attribute
     * @param mixed $subject
     * @return bool
     */
    protected function supports(string $attribute, mixed $subject): bool
    {
        return $attribute === self::VISIT_PATCH_ACCESS_CHECK;
    }

    /**
     * @param string $attribute
     * @param mixed $subject
     * @param JWTUserToken $token
     * @return bool
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user) {
            return false;
        }

        $id = $user->getId()->toRfc4122();

        if (
            $id == $subject->getClient()->getId()->toRfc4122() ||
            $id == $subject->getDoctor()->getId()->toRfc4122()
        ) {
            return true;
        }

        return false;
    }

}
