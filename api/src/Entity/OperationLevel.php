<?php

namespace App\Entity;

use App\Repository\OperationLevelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;

#[ORM\Entity(repositoryClass: OperationLevelRepository::class)]
class OperationLevel
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
    #[ORM\Column(length: 20)]
    private ?string $title = null;

    /**
     * @var string|null
     */
    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 5)]
    private ?string $coefficient = null;

    /**
     * @var string|null
     */
    #[ORM\Column(type: Types::INTEGER)]
    private ?string $staffCount = null;

    /**
     * @var Collection
     */
    #[ORM\OneToMany(mappedBy: "level", targetEntity: Operation::class)]
    private Collection $operations;

    /** OperationLevel constructor */
    public function __construct()
    {
        $this->operations = new ArrayCollection();
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
    public function getCoefficient(): ?string
    {
        return $this->coefficient;
    }

    /**
     * @param string|null $coefficient
     * @return $this
     */
    public function setCoefficient(?string $coefficient): self
    {
        $this->coefficient = $coefficient;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getStaffCount(): ?string
    {
        return $this->staffCount;
    }

    /**
     * @param string|null $staffCount
     * @return $this
     */
    public function setStaffCount(?string $staffCount): self
    {
        $this->staffCount = $staffCount;

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

}
