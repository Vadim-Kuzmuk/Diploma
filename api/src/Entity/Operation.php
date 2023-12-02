<?php

namespace App\Entity;

use App\Repository\OperationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Positive;

#[ORM\Entity(repositoryClass: OperationRepository::class)]
class Operation
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
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Positive]
    #[ORM\Column(type: Types::BIGINT)]
    private ?string $date = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[Positive]
    #[ORM\Column(type: Types::INTEGER)]
    private ?string $duration = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[Positive]
    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $price = null;

    /**
     * @var OperationLevel|null
     */
    #[ORM\ManyToOne(targetEntity: OperationLevel::class, inversedBy: "operations")]
    private ?OperationLevel $level = null;

    /**
     * @var Room|null
     */
    #[ORM\ManyToOne(targetEntity: Room::class, inversedBy: 'operations')]
    private ?Room $room = null;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'doctorOperations')]
    private ?User $doctor = null;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'clientOperations')]
    private ?User $client = null;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'operation', targetEntity: StaffOperation::class)]
    private Collection $staff;

    /** Operation constructor */
    public function __construct()
    {
        $this->staff = new ArrayCollection();
    }

    /**
     * @return Uuid|null
     */
    public function getId(): ?Uuid
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getDate(): ?string
    {
        return $this->date;
    }

    /**
     * @param string|null $date
     * @return $this
     */
    public function setDate(?string $date): self
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getDuration(): ?string
    {
        return $this->duration;
    }

    /**
     * @param string|null $duration
     * @return $this
     */
    public function setDuration(?string $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getPrice(): ?string
    {
        return $this->price;
    }

    /**
     * @param string|null $price
     * @return $this
     */
    public function setPrice(?string $price): self
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @return OperationLevel|null
     */
    public function getLevel(): ?OperationLevel
    {
        return $this->level;
    }

    /**
     * @param OperationLevel|null $level
     * @return $this
     */
    public function setLevel(?OperationLevel $level): self
    {
        $this->level = $level;

        return $this;
    }

    /**
     * @return Room|null
     */
    public function getRoom(): ?Room
    {
        return $this->room;
    }

    /**
     * @param Room|null $room
     * @return $this
     */
    public function setRoom(?Room $room): self
    {
        $this->room = $room;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getDoctor(): ?User
    {
        return $this->doctor;
    }

    /**
     * @param User|null $doctor
     * @return Operation
     */
    public function setDoctor(?User $doctor): self
    {
        $this->doctor = $doctor;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getClient(): ?User
    {
        return $this->client;
    }

    /**
     * @param User|null $client
     * @return $this
     */
    public function setClient(?User $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getStaff(): Collection
    {
        return $this->staff;
    }

    /**
     * @param Collection $staff
     * @return $this
     */
    public function setStaff(Collection $staff): self
    {
        $this->staff = $staff;

        return $this;
    }

}
