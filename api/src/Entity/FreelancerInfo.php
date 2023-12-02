<?php

namespace App\Entity;

use App\Repository\FreelancerInfoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Positive;

#[ORM\Entity(repositoryClass: FreelancerInfoRepository::class)]
class FreelancerInfo
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
    #[ORM\Column(type: Types::JSON)]
    private ?string $grades = null;

    /**
     * @var string|null
     */
    #[NotNull]
    #[Positive]
    #[ORM\Column(type: Types::DECIMAL, precision: 7, scale: 2)]
    private ?string $consultationPrice = null;

    /**
     * @var int|null
     */
    #[NotNull]
    #[GreaterThanOrEqual(10)]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $duration = null;

    /**
     * @var User|null
     */
    #[ORM\OneToOne(inversedBy: 'freelancerInfo')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var Speciality|null
     */
    #[ORM\ManyToOne(targetEntity: Speciality::class, inversedBy: 'freelancers')]
    private ?Speciality $speciality = null;

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
    public function getGrades(): ?string
    {
        return $this->grades;
    }

    /**
     * @param string|null $grades
     * @return $this
     */
    public function setGrades(?string $grades): self
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

}
