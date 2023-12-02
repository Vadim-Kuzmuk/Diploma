<?php

namespace App\Entity;

use App\Repository\HistoryAccessRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: HistoryAccessRepository::class)]
class HistoryAccess
{

    /**
     * @var Uuid|null
     */
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'ownerHistoryAccesses')]
    private ?User $owner = null;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'allowedHistoryAccesses')]
    private ?User $allowed = null;

    /**
     * @return Uuid|null
     */
    public function getId(): ?Uuid
    {
        return $this->id;
    }

    /**
     * @return User|null
     */
    public function getOwner(): ?User
    {
        return $this->owner;
    }

    /**
     * @param User|null $owner
     * @return $this
     */
    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getAllowed(): ?User
    {
        return $this->allowed;
    }

    /**
     * @param User|null $allowed
     * @return $this
     */
    public function setAllowed(?User $allowed): self
    {
        $this->allowed = $allowed;

        return $this;
    }

}
