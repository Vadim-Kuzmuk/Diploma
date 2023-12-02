<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\StaffInfoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Positive;

#[ORM\Entity(repositoryClass: StaffInfoRepository::class)]
#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:staff-info"]]
        ],
        "post" => [
            "method"                  => "POST",
            "denormalization_context" => ['groups' => ["post:collection:staff-info"]],
            "normalization_context"   => ['groups' => ["get:item:staff-info"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:staff-info"]]
        ],
        "put"    => [
            "method"                  => "PUT",
            "denormalization_context" => ['groups' => ["put:item:staff-info"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "')"
        ],
        "delete" => [
            "method"   => "DELETE",
            "security" => "is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ]
)]
class StaffInfo
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
    #[Positive]
    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups([
        "get:collection:staff-info",
        "post:collection:staff-info",
        "get:item:staff-info",
        "put:item:staff-info"
    ])]
    private ?string $operationPrice = null;

    /**
     * @var Department|null
     */
    #[ORM\ManyToOne(targetEntity: Department::class, inversedBy: 'staffInfos')]
    #[Groups([
        "get:collection:staff-info",
        "post:collection:staff-info",
        "get:item:staff-info",
        "put:item:staff-info"
    ])]
    private ?Department $department = null;

    /**
     * @var User|null
     */
    #[ORM\OneToOne(inversedBy: 'staffInfo')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

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

}
