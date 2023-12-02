<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ClientInfoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotNull;

#[ORM\Entity(repositoryClass: ClientInfoRepository::class)]
#[ApiResource(
    collectionOperations: [
        "get"  => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:collection:client-info"]],
            "security"                => "is_granted('" . User::ROLE_CLIENT . "') or is_granted('" . User::ROLE_ADMIN . "')"
        ]
    ],
    itemOperations: [
        "get"    => [
            "method"                => "GET",
            "normalization_context" => ['groups' => ["get:item:client-info"]],
            "security"                => "is_granted('" . User::ROLE_CLIENT . "')"
        ],
        "put"    => [
            "method"                  => "PUT",
            "denormalization_context" => ['groups' => ["put:item:client-info"]],
            "security"                => "is_granted('" . User::ROLE_CLIENT . "')"
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
class ClientInfo
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
    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups([
        "get:collection:client-info",
        "post:collection:client-info",
        "get:item:client-info",
        "put:item:client-info",
    ])]
    private ?string $isParent = null;

    /**
     * @var Family|null
     */
    #[ORM\ManyToOne(targetEntity: Family::class, inversedBy: 'clients')]
    #[Groups([
        "get:collection:client-info",
        "post:collection:client-info",
        "get:item:client-info",
        "put:item:client-info",
    ])]
    private ?Family $family = null;

    /**
     * @var User|null
     */
    #[ORM\OneToOne(inversedBy: 'clientInfo')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([
        "get:collection:client-info",
        "get:item:client-info"
    ])]
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
    public function getIsParent(): ?string
    {
        return $this->isParent;
    }

    /**
     * @param string|null $isParent
     * @return $this
     */
    public function setIsParent(?string $isParent): self
    {
        $this->isParent = $isParent;

        return $this;
    }

    /**
     * @return Family|null
     */
    public function getFamily(): ?Family
    {
        return $this->family;
    }

    /**
     * @param Family|null $family
     * @return $this
     */
    public function setFamily(?Family $family): self
    {
        $this->family = $family;

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
