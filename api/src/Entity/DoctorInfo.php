<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\DoctorInfoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Positive;
use Symfony\Component\Validator\Constraints\PositiveOrZero;

#[ORM\Entity(repositoryClass: DoctorInfoRepository::class)]
#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:doctor-info"]]
        ],
        "post" => [
            "method"                  => "POST",
            "denormalization_context" => ['groups' => ["post:collection:doctor-info"]],
            "normalization_context"   => ['groups' => ["get:item:doctor-info"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:doctor-info"]]
        ],
        "patch"  => [
            "method"                  => "PATCH",
            "denormalization_context" => ['groups' => ["patch:item:doctor-info"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "') or object.getUser() == user"
        ],
        "delete" => [
            "method"   => "DELETE",
            "security" => "is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ],
    attributes: [
        "order" => [
            "user.lastName" => "ASC"
        ]
    ]
)]
class DoctorInfo implements JsonSerializable
{

    /**
     * @var Uuid|null
     */
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups([
        "get:item:user",
        "get:item:doctor-info",
        "get:collection:doctor-info",
        "get:item:speciality"
    ])]
    private ?Uuid $id = null;

    /**
     * @var array|null
     */
    #[ORM\Column(type: Types::JSON)]
    #[Groups([
        "get:item:doctor-info",
        "get:collection:doctor-info",
        "post:collection:doctor-info",
        "get:item:user"
    ])]
    private ?array $grades = null;

    /**
     * @var string|null
     */
    #[PositiveOrZero]
    #[NotNull]
    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2, nullable: true)]
    #[Groups([
        "get:collection:doctor-info",
        "get:item:speciality",
        "get:item:doctor-info",
        "post:collection:doctor-info",
        "patch:item:doctor-info",
        "get:item:user"
    ])]
    private ?string $consultationPrice = null;

    /**
     * @var string|null
     */
    #[PositiveOrZero]
    #[NotNull]
    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2, nullable: true)]
    #[Groups([
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "get:item:speciality",
        "post:collection:doctor-info",
        "patch:item:doctor-info",
        "get:item:user"
    ])]
    private ?string $visitPrice = null;

    /**
     * @var string|null
     */
    #[PositiveOrZero]
    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    #[Groups([
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "get:item:speciality",
        "post:collection:doctor-info",
        "get:item:user"
    ])]
    private ?string $operationPrice = null;

    /**
     * @var int|null
     */
    #[NotNull]
    #[GreaterThanOrEqual(10)]
    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    #[Groups([
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "get:item:speciality",
        "post:collection:doctor-info",
        "patch:item:doctor-info",
        "get:item:user"
    ])]
    private ?int $duration = null;

    /**
     * @var array|null
     */
    #[NotNull]
    #[ORM\Column(type: Types::JSON)]
    #[Groups([
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "post:collection:doctor-info",
        "patch:item:doctor-info",
        "get:item:speciality"
    ])]
    private ?array $formats = null;

    /**
     * @var User|null
     */
    #[ORM\OneToOne(inversedBy: 'doctorInfo')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([
        "post:collection:doctor-info",
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "get:item:speciality",
        "patch:item:doctor-info"
    ])]
    private ?User $user = null;

    /**
     * @var Room|null
     */
    #[Groups([
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "post:collection:doctor-info",
        "patch:item:doctor-info",
        "get:item:speciality",
        "get:item:user"
    ])]
    #[ORM\ManyToOne(targetEntity: Room::class, inversedBy: 'doctors')]
    private ?Room $room = null;

    /**
     * @var Speciality|null
     */
    #[Groups([
        "get:item:doctor-info",
        "get:item:user"
    ])]
    #[ORM\ManyToOne(targetEntity: Speciality::class, inversedBy: 'doctors')]
    private ?Speciality $speciality = null;

    /**
     * @return Uuid|null
     */
    public function getId(): ?Uuid
    {
        return $this->id;
    }

    /**
     * @return array|null
     */
    public function getGrades(): ?array
    {
        return $this->grades;
    }

    /**
     * @param array|null $grades
     * @return $this
     */
    public function setGrades(?array $grades): self
    {
        $this->grades = $grades;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getConsultationPrice(): ?string
    {
        return $this->consultationPrice;
    }

    /**
     * @param string|null $consultationPrice
     * @return $this
     */
    public function setConsultationPrice(?string $consultationPrice): self
    {
        $this->consultationPrice = $consultationPrice;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getVisitPrice(): ?string
    {
        return $this->visitPrice;
    }

    /**
     * @param string|null $visitPrice
     * @return $this
     */
    public function setVisitPrice(?string $visitPrice): self
    {
        $this->visitPrice = $visitPrice;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getOperationPrice(): ?string
    {
        return $this->operationPrice;
    }

    /**
     * @param string|null $operationPrice
     * @return $this
     */
    public function setOperationPrice(?string $operationPrice): self
    {
        $this->operationPrice = $operationPrice;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getDuration(): ?int
    {
        return $this->duration;
    }

    /**
     * @param int|null $duration
     * @return $this
     */
    public function setDuration(?int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getFormats(): ?array
    {
        return $this->formats;
    }

    /**
     * @param array|null $formats
     * @return $this
     */
    public function setFormats(?array $formats): self
    {
        $this->formats = $formats;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User $user
     * @return $this
     */
    public function setUser(User $user): self
    {
        $this->user = $user;

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
     * @return Speciality|null
     */
    public function getSpeciality(): ?Speciality
    {
        return $this->speciality;
    }

    /**
     * @param Speciality|null $speciality
     * @return $this
     */
    public function setSpeciality(?Speciality $speciality): self
    {
        $this->speciality = $speciality;

        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            "id"                => $this->getId(),
            "grades"            => $this->getGrades(),
            "consultationPrice" => $this->getConsultationPrice(),
            "visitPrice"        => $this->getVisitPrice(),
            "operationPrice"    => $this->getOperationPrice(),
            "duration"          => $this->getDuration(),
            "formats"           => $this->getFormats(),
            "user"              => [
                "id"        => $this->getUser()->getId(),
                "firstName" => $this->getUser()->getFirstName(),
                "lastName"  => $this->getUser()->getLastName()
            ],
            "room"              => [
                "id"     => $this->getRoom()->getId(),
                "number" => $this->getRoom()->getNumber(),
                "name"   => $this->getRoom()->getName()
            ],
            "speciality"        => [
                "id"         => $this->getSpeciality()->getId(),
                "title"      => $this->getSpeciality()->getTitle(),
                "department" => $this->getSpeciality()->getDepartment()
            ]
        ];
    }

}


