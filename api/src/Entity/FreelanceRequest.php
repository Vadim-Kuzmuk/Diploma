<?php

namespace App\Entity;

use App\Repository\FreelanceRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotNull;

#[ORM\Entity(repositoryClass: FreelanceRequestRepository::class)]
class FreelanceRequest
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
    #[ORM\Column(type: Types::BIGINT)]
    private ?string $date = null;

    #[ORM\OneToOne(inversedBy: 'freelanceRequest')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $freelancer = null;

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
     * @return User|null
     */
    public function getFreelancer(): ?User
    {
        return $this->freelancer;
    }

    /**
     * @param User $freelancer
     * @return $this
     */
    public function setFreelancer(User $freelancer): self
    {
        $this->freelancer = $freelancer;

        return $this;
    }

}
