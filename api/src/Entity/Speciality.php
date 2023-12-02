<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\SpecialityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;

#[ORM\Entity(repositoryClass: SpecialityRepository::class)]
#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:speciality"]]
        ],
        "post" => [
            "method"                  => "POST",
            "denormalization_context" => ['groups' => ["post:collection:speciality"]],
            "normalization_context"   => ['groups' => ["get:item:speciality"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:speciality"]]
        ],
        "put"    => [
            "method"                  => "PUT",
            "denormalization_context" => ['groups' => ["put:item:speciality"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
        "patch"  => [
            "method"                  => "PATCH",
            "denormalization_context" => ['groups' => ["patch:item:speciality"]],
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
#[ApiFilter(SearchFilter::class, properties: [
    "title" => "partial"
])]
class Speciality
{
    /**
     * @var Uuid|null
     */
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups([
        "get:collection:speciality",
        "get:item:speciality",
        "get:item:department",
        "get:item:doctor-info"
    ])]
    private ?Uuid $id = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[ORM\Column(length: 255)]
    #[Groups([
        "get:collection:doctor-info",
        "get:item:doctor-info",
        "get:collection:speciality",
        "get:item:speciality",
        "get:item:department",
        "post:collection:speciality",
        "get:item:doctor-info",
        "get:item:user",
        "patch:item:speciality"
    ])]
    private ?string $title = null;

    /**
     * @var Department|null
     */
    #[ORM\ManyToOne(targetEntity: Department::class, inversedBy: "specialities")]
    #[Groups([
        "get:collection:speciality",
        "get:item:speciality",
        "post:collection:speciality",
        "get:item:doctor-info",
        "patch:item:speciality"
    ])]
    private ?Department $department = null;

    /**
     * @var Collection
     */
    #[Groups([
        "get:item:speciality"
    ])]
    #[ORM\OneToMany(mappedBy: 'speciality', targetEntity: DoctorInfo::class)]
    private Collection $doctors;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'speciality', targetEntity: FreelancerInfo::class)]
    private Collection $freelancers;

    /** Speciality constructor */
    public function __construct()
    {
        $this->doctors = new ArrayCollection();
        $this->freelancers = new ArrayCollection();
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
    public function getFreelancers(): Collection
    {
        return $this->freelancers;
    }

    /**
     * @param Collection $freelancers
     * @return $this
     */
    public function setFreelancers(Collection $freelancers): self
    {
        $this->freelancers = $freelancers;

        return $this;
    }

}
