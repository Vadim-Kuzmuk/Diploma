<?php

namespace App\Entity;

use App\Repository\FamilyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Regex;

#[ORM\Entity(repositoryClass: FamilyRepository::class)]
class Family
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
    #[ORM\Column(type: Types::BIGINT)]
    private ?string $creationDate = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[Regex(
        pattern: '^\+38\(0(?!0{2})[0-9]{2}\)-[0-9]{3}-[0-9]{2}-[0-9]{2}$',
        message: "Phone number must match the +38(0XX)-XXX-XX-XX format"
    )]
    #[ORM\Column(length: 14)]
    private ?string $contactPhone = null;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'family', targetEntity: ClientInfo::class)]
    private Collection $clients;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: 'family', targetEntity: Invite::class)]
    private Collection $invites;

    /** Family constructor */
    public function __construct()
    {
        $this->clients = new ArrayCollection();
        $this->invites = new ArrayCollection();
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
    public function getCreationDate(): ?string
    {
        return $this->creationDate;
    }

    /**
     * @param string|null $creationDate
     * @return $this
     */
    public function setCreationDate(?string $creationDate): self
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getContactPhone(): ?string
    {
        return $this->contactPhone;
    }

    /**
     * @param string|null $contactPhone
     * @return $this
     */
    public function setContactPhone(?string $contactPhone): self
    {
        $this->contactPhone = $contactPhone;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getClients(): Collection
    {
        return $this->clients;
    }

    /**
     * @param Collection $clients
     * @return $this
     */
    public function setClients(Collection $clients): self
    {
        $this->clients = $clients;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getInvites(): Collection
    {
        return $this->invites;
    }

    /**
     * @param Collection $invites
     * @return $this
     */
    public function setInvites(Collection $invites): self
    {
        $this->invites = $invites;

        return $this;
    }

}
