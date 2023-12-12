<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\WorkRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\PositiveOrZero;

#[ORM\Entity(repositoryClass: WorkRepository::class)]
#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:work"]]
        ],
        "post" => [
            "method"                  => "POST",
            "denormalization_context" => ['groups' => ["post:collection:work"]],
            "normalization_context"   => ['groups' => ["get:item:work"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "') or is_granted('" . User::ROLE_DOCTOR . "')"
        ]
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:work"]]
        ],
        "put"    => [
            "method"                  => "PUT",
            "denormalization_context" => ['groups' => ["put:item:work"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "') or is_granted('" . User::ROLE_DOCTOR . "')"
        ],
        "patch"  => [
            "method"                  => "PATCH",
            "denormalization_context" => ['groups' => ["patch:item:work"]],
            "security"                => "is_granted('" . User::ROLE_ADMIN . "') or is_granted('" . User::ROLE_DOCTOR . "')"
        ],
        "delete" => [
            "method"   => "DELETE",
            "security" => "is_granted('" . User::ROLE_ADMIN . "') or is_granted('" . User::ROLE_DOCTOR . "')"
        ]
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['created' => 'DESC'])]
class Work implements JsonSerializable
{

    /**
     * @var Uuid|null
     */
    #[ORM\Id]
    #[ORM\Column(type: "uuid", unique: true)]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups([
        "get:collection:work",
        "get:item:work"
    ])]
    private ?Uuid $id = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[NotBlank]
    #[ORM\Column(length: 255)]
    #[Groups([
        "get:collection:work",
        "post:collection:work",
        "get:item:work",
        "put:item:work",
        "patch:item:work"
    ])]
    private ?string $title = null;

    /**
     * @var string|null
     */
    #[PositiveOrZero]
    #[NotNull]
    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2, nullable: true)]
    #[Groups([
        "get:collection:work",
        "post:collection:work",
        "get:item:work",
        "put:item:work",
        "patch:item:work"
    ])]
    private ?string $hours = null;

    /**
     * @var int|null
     */
    #[NotNull]
    #[ORM\Column(type: "integer")]
    #[Groups([
        "get:collection:work",
        "post:collection:work",
        "get:item:work",
        "put:item:work",
        "patch:item:work"
    ])]
    private ?int $seconds = null;

    /**
     * @var string
     */
    #[ORM\Column(type: "string", length: 255, nullable: false)]
    #[Groups([
        "get:collection:work",
        "post:collection:work",
        "get:item:work",
        "put:item:work",
        "patch:item:work"
    ])]
    private string $created;

    /**
     * @var User|null
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'doctorWork')]
    #[Groups([
        "post:collection:work",
        "get:item:work",
        "get:collection:work"
    ])]
    private ?User $user = null;

    public function __construct()
    {
        $this->created = (new DateTimeImmutable())->format('Y-m-d H:i:s');
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

    public function getHours(): ?string
    {
        return $this->hours;
    }

    public function setHours(?string $hours): self
    {
        $this->hours = $hours;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getSeconds(): ?int
    {
        return $this->seconds;
    }

    /**
     * @param int|null $seconds
     * @return $this
     */
    public function setSeconds(?int $seconds): self
    {
        $this->seconds = $seconds;

        return $this;
    }

    public function getCreated(): string
    {
        return $this->created;
    }

    public function setCreated(?string $created): self
    {
        $this->created = $created;

        return $this;
    }

    /**
     * @ORM\PrePersist
     */
    public function setCreatedValue(): void
    {
        $this->created = (new DateTimeImmutable())->format('Y-m-d H:i:s');
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'id'        => $this->id,
            'title'     => $this->title,
            'hours'     => $this->hours,
            'seconds'   => $this->seconds,
            'created' => $this->created,
            'user'      => [
                'id' => $this->getUser()->getId()
            ],
        ];
    }

}