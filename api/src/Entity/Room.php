<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\RoomRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;

#[ORM\Entity(repositoryClass: RoomRepository::class)]
#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:room"]]
        ],
        "post" => [
            "method"                  => "POST",
            "denormalization_context" => ['groups' => ["post:collection:room"]],
            "normalization_context"   => ['groups' => ["get:item:room"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:room"]]
        ],
        "put"    => [
            "method"                  => "PUT",
            "denormalization_context" => ['groups' => ["put:item:room"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
        "patch"  => [
            "method"                  => "PATCH",
            "denormalization_context" => ['groups' => ["patch:item:room"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
        "delete" => [
            "method"   => "DELETE",
            "security" => "is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ],
    attributes: [
        "order" => [
            "number" => "ASC"
        ]
    ]
)]
class Room
{

    /**
     * @var Uuid|null
     */
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups([
        "get:collection:room",
        "get:item:room",
        "get:item:speciality",
        "get:item:doctor-info",
        "get:collection:doctor-info"
    ])]
    private ?Uuid $id = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[ORM\Column(length: 10)]
    #[Groups([
        "get:collection:room",
        "post:collection:room",
        "get:item:room",
        "put:item:room",
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "get:item:visit",
        "get:collection:visit",
        "get:item:speciality",
        "get:item:user",
        "patch:item:room"
    ])]
    private ?string $number = null;

    /**
     * @var string|null
     */
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([
        "get:collection:room",
        "post:collection:room",
        "get:item:room",
        "put:item:room",
        "get:item:speciality",
        "get:item:doctor-info",
        "patch:item:room"
    ])]
    private ?string $name = null;

    /**
     * @var Department|null
     */
    #[ORM\ManyToOne(targetEntity: Department::class, inversedBy: "rooms")]
    #[Groups([
        "get:collection:room",
        "post:collection:room",
        "get:item:room",
        "put:item:room",
        "patch:item:room"
    ])]
    private ?Department $department = null;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: "room", targetEntity: Operation::class)]
    private Collection $operations;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'room', targetEntity: DoctorInfo::class)]
    private Collection $doctors;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'room', targetEntity: Visit::class)]
    private Collection $visits;

    /** Room constructor */
    public function __construct()
    {
        $this->operations = new ArrayCollection();
        $this->doctors = new ArrayCollection();
        $this->visits = new ArrayCollection();
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
    public function getNumber(): ?string
    {
        return $this->number;
    }

    /**
     * @param string|null $number
     * @return $this
     */
    public function setNumber(?string $number): self
    {
        $this->number = $number;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     * @return $this
     */
    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Department|null
     */
    public function getDepartment(): ?Department
    {
        return $this->department;
    }

    /**
     * @param Department|null $department
     * @return $this
     */
    public function setDepartment(?Department $department): self
    {
        $this->department = $department;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getOperations(): Collection
    {
        return $this->operations;
    }

    /**
     * @param Collection $operations
     * @return $this
     */
    public function setOperations(Collection $operations): self
    {
        $this->operations = $operations;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getDoctors(): Collection
    {
        return $this->doctors;
    }

    /**
     * @param Collection $doctors
     * @return $this
     */
    public function setDoctors(Collection $doctors): self
    {
        $this->doctors = $doctors;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getVisits(): Collection
    {
        return $this->visits;
    }

    /**
     * @param Collection $visits
     * @return $this
     */
    public function setVisits(Collection $visits): self
    {
        $this->visits = $visits;

        return $this;
    }

}
