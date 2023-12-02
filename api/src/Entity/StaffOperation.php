<?php

namespace App\Entity;

use App\Repository\StaffOperationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: StaffOperationRepository::class)]
class StaffOperation
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
     * @var Operation|null
     */
    #[ORM\ManyToOne(targetEntity: Operation::class, inversedBy: 'staff')]
    private ?Operation $operation = null;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'staffOperations')]
    private ?User $staff = null;

    /**
     * @return Uuid|null
     */
    public function getId(): ?Uuid
    {
        return $this->id;
    }

    /**
     * @return Operation|null
     */
    public function getOperation(): ?Operation
    {
        return $this->operation;
    }

    /**
     * @param Operation|null $operation
     * @return $this
     */
    public function setOperation(?Operation $operation): self
    {
        $this->operation = $operation;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getStaff(): ?User
    {
        return $this->staff;
    }

    /**
     * @param User|null $staff
     * @return $this
     */
    public function setStaff(?User $staff): self
    {
        $this->staff = $staff;

        return $this;
    }

}
