<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Action\UpdateDoctorReceptionTimesAction;
use App\Repository\ReceptionTimeRepository;
use App\Validator\Constraints\ReceptionTimeConstraint;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Positive;

#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:reception-time"]]
        ],
        "post" => [
            "method"                  => "POST",
            "denormalization_context" => ['groups' => ["post:collection:reception-time"]],
            "normalization_context"   => ['groups' => ["get:item:reception-time"]],
            "security"                => "is_granted('" . User::ROLE_DOCTOR . "')"
        ],
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:reception-time"]]
        ],
        "delete" => [
            "method"   => "DELETE",
            "security" => "is_granted('" . User::ROLE_DOCTOR . "')"
        ],
        "patch"  => [
            "method"                  => "PATCH",
            "denormalization_context" => ['groups' => ["patch:item:reception-time"]],
            "normalization_context"   => ['groups' => ["get:item:reception-time"]],
            "security"                => "is_granted('" . User::ROLE_DOCTOR . "')"
        ]
    ]
)]
#[ReceptionTimeConstraint]
#[ORM\Entity(repositoryClass: ReceptionTimeRepository::class)]
class ReceptionTime
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
    #[Groups([
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "post:collection:reception-time",
        "get:item:reception-time",
        "patch:item:reception-time"
    ])]
    private ?string $start = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Positive]
    #[ORM\Column(type: Types::BIGINT)]
    #[Groups([
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "post:collection:reception-time",
        "get:item:reception-time",
        "patch:item:reception-time"
    ])]
    private ?string $end = null;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'receptionTimes')]
    #[Groups(
        "post:collection:reception-time"
    )]
    private ?User $doctor = null;

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
    public function getStart(): ?string
    {
        return $this->start;
    }

    /**
     * @param string|null $start
     * @return $this
     */
    public function setStart(?string $start): self
    {
        $this->start = $start;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getEnd(): ?string
    {
        return $this->end;
    }

    /**
     * @param string|null $end
     * @return $this
     */
    public function setEnd(?string $end): self
    {
        $this->end = $end;

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
     * @return $this
     */
    public function setDoctor(?User $doctor): self
    {
        $this->doctor = $doctor;

        return $this;
    }

}
