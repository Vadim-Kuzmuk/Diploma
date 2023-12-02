<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Action\CreateLinkAction;
use App\Action\CreateVisitAction;
use App\Repository\VisitRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Positive;

#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:visit"]],
            "security"              => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
        "post" => [
            "method"                  => "POST",
            "denormalization_context" => ['groups' => ["post:collection:visit"]],
            "normalization_context"   => ['groups' => ["get:item:visit"]],
            "controller"              => CreateVisitAction::class,
            "security"                => "is_granted('" . User::ROLE_CLIENT . "')"
        ]
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:visit"]],
            "security"              => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
        "patch"  => [
            "method"                  => "PATCH",
            "denormalization_context" => ['groups' => ["patch:item:visit"]],
            "normalization_context"   => ['groups' => ["get:item:visit"]],
            "security"                => "is_granted('VISIT_PATCH_ACCESS_CHECK', object)",
            "controller"              => CreateLinkAction::class
        ],
        "delete" => [
            "method"   => "DELETE",
            "security" => "is_granted('VISIT_DELETE_ACCESS_CHECK', object)"
        ]
    ]
)]
#[ORM\Entity(repositoryClass: VisitRepository::class)]
class Visit
{

    /**
     * @var Uuid|null
     */
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups([
        "get:item:visit",
        "get:collection:visit"
    ])]
    private ?Uuid $id = null;

    /**
     * @var string|null
     */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([
        "get:collection:visit",
        "get:item:visit",
    ])]
    private ?string $link = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Positive]
    #[ORM\Column(type: Types::BIGINT)]
    #[Groups([
        "get:item:visit",
        "get:collection:visit",
        "post:collection:visit"
    ])]
    private ?string $date = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[GreaterThanOrEqual(10)]
    #[ORM\Column(type: Types::INTEGER)]
    #[Groups([
        "get:item:visit",
        "get:collection:visit",
    ])]
    private ?string $duration = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[Positive]
    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2)]
    #[Groups([
        "get:item:visit",
        "get:collection:visit",
    ])]
    private ?string $price = null;

    /**
     * @var string|null
     */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([
        "get:item:visit",
        "get:collection:visit",
        "patch:item:visit"
    ])]
    private ?string $conclusion = null;

    /**
     * @var string|null
     */
    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    #[Groups([
        "get:item:visit",
        "get:collection:visit",
        "patch:item:visit"
    ])]
    private ?string $isPaid = null;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'clientVisits')]
    #[Groups([
        "get:item:visit",
        "get:collection:visit",
    ])]
    private ?User $client = null;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'doctorVisits')]
    #[Groups([
        "post:collection:visit",
        "get:item:visit",
        "get:collection:visit",
    ])]
    private ?User $doctor = null;

    /**
     * @var Room|null
     */
    #[ORM\ManyToOne(targetEntity: Room::class, inversedBy: 'visits')]
    #[Groups([
        "get:item:visit",
        "get:collection:visit",
        "post:collection:visit"
    ])]
    private ?Room $room = null;

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
    public function getLink(): ?string
    {
        return $this->link;
    }

    /**
     * @param string|null $link
     * @return $this
     */
    public function setLink(?string $link): self
    {
        $this->link = $link;

        return $this;
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
     * @return string|null
     */
    public function getConclusion(): ?string
    {
        return $this->conclusion;
    }

    /**
     * @param string|null $conclusion
     * @return $this
     */
    public function setConclusion(?string $conclusion): self
    {
        $this->conclusion = $conclusion;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getIsPaid(): ?string
    {
        return $this->isPaid;
    }

    /**
     * @param string|null $isPaid
     * @return $this
     */
    public function setIsPaid(?string $isPaid): self
    {
        $this->isPaid = $isPaid;

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

}
