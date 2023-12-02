<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\DepartmentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Regex;

#[ORM\Entity(repositoryClass: DepartmentRepository::class)]
#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:department"]]
        ],
        "post" => [
            "method"                  => "POST",
            "denormalization_context" => ['groups' => ["post:collection:department"]],
            "normalization_context"   => ['groups' => ["get:item:department"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:department"]]
        ],
        "put"    => [
            "method"                  => "PUT",
            "denormalization_context" => ['groups' => ["put:item:department"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
        "patch"  => [
            "method"                  => "PATCH",
            "denormalization_context" => ['groups' => ["patch:item:department"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
        "delete" => [
            "method"   => "DELETE",
            "security" => "is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ],
    attributes: [
        "order" => [
            "title" => "ASC"
        ]
    ]
)]
class Department {
    /**
     * @var Uuid|null
     */
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups([
        "get:collection:department",
        "get:collection:speciality",
        "get:item:speciality",
        "get:collection:department",
        "get:item:department",
        "get:collection:room",
        "get:item:room",
        "get:item:speciality",
        "get:item:doctor-info",
        "patch:item:room"
    ])]
    private ?Uuid $id = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[ORM\Column(length: 255)]
    #[Groups([
        "get:collection:department",
        "post:collection:department",
        "get:item:department",
        "put:item:department",
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "get:collection:speciality",
        "get:item:speciality",
        "get:item:doctor-info",
        "get:collection:room",
        "get:item:room",
        "patch:item:department"
    ])]
    private ?string $title = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[Regex(
        pattern: '/^\+38\(0(?!0{2})[0-9]{2}\)-[0-9]{3}-[0-9]{2}-[0-9]{2}$/',
        message: "invalid-phone"
    )]
    #[Groups([
        "get:collection:department",
        "post:collection:department",
        "get:item:department",
        "put:item:department",
        "get:item:doctor-info",
        "patch:item:department"
    ])]
    #[ORM\Column(length: 20)]
    private ?string $phone = null;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: "department", targetEntity: Room::class)]
    private Collection $rooms;

    /**
     * @var Collection
     */

    #[Groups([
        "get:item:department"
    ])]
    #[ORM\OneToMany(mappedBy: "department", targetEntity: Speciality::class)]
    private Collection $specialities;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: "department", targetEntity: StaffInfo::class)]
    private Collection $staffInfos;

    /** Department constructor */
    public function __construct()
    {
        $this->rooms = new ArrayCollection();
        $this->specialities = new ArrayCollection();
        $this->staffInfos = new ArrayCollection();
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
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string|null $title
     * @return $this
     */
    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getPhone(): ?string
    {
        return $this->phone;
    }

    /**
     * @param string|null $phone
     * @return $this
     */
    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getRooms(): Collection
    {
        return $this->rooms;
    }

    /**
     * @param Collection $rooms
     * @return $this
     */
    public function setRooms(Collection $rooms): self
    {
        $this->rooms = $rooms;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getSpecialities(): Collection
    {
        return $this->specialities;
    }

    /**
     * @param Collection $specialities
     * @return $this
     */
    public function setSpecialities(Collection $specialities): self
    {
        $this->specialities = $specialities;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getStaffInfos(): Collection
    {
        return $this->staffInfos;
    }

    /**
     * @param Collection $staffInfos
     * @return $this
     */
    public function setStaffInfos(Collection $staffInfos): self
    {
        $this->staffInfos = $staffInfos;

        return $this;
    }

}
